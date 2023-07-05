import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';
import { SignUpRequest } from '../models/sign-up.model';
import { ROLE } from '../constants/role.constant';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _avatarUpdate: BehaviorSubject<string> = new BehaviorSubject<string>('');

    private accessToken: string;

    constructor(
        private _httpClient: HttpClient
    ) { 
        this.accessToken = localStorage.getItem('accessToken') || '';
    }

    getUserById(): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        let decodedJWT = JSON.parse(window.atob(this.accessToken.split('.')[1]));
        let userId = decodedJWT?.id;
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/user/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    getUserInfoById(): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        let decodedJWT = JSON.parse(window.atob(this.accessToken.split('.')[1]));
        let userId = decodedJWT?.id;
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/user/info/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    getUserInfo(userId: string): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/user/info/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    updateUser(body: SignUpRequest): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/user`, body, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    getAllUsers(): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/user`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }

    updateAccountStatus(id: string): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/user/lock/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    isAgency(): boolean {
        let roleStorage = localStorage.getItem('roles') || '';
        let roles = roleStorage.split(',');
        if (roles.includes(ROLE.ROLE_AGENCY)) {
            return true;
        }
        return false;
    }

    isAdmin(): boolean {
        let roleStorage = localStorage.getItem('roles') || '';
        if (roleStorage === ROLE.ROLE_ADMIN) {
            return true;
        } else {
            return false;
        }
    }

    isEnterprise(): boolean {
        let roleStorage = localStorage.getItem('roles') || '';
        if (roleStorage === ROLE.ROLE_ENTERPRISE) {
            return true;
        } else {
            return false;
        }
    }

    isNormalUser(): boolean {
        let roleStorage = localStorage.getItem('roles') || '';
        if (roleStorage === ROLE.ROLE_USER) {
            return true;
        } else {
            return false;
        }
    }

    getUserNoAuthById(userId: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/user/${userId}`);
    }

    get avatarUpdate$(): Observable<string> {
        return this._avatarUpdate.asObservable();
    }

    updateUserInfo(path: string): void {
        this._avatarUpdate.next(path);
    }
}
