import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';
import { SignUpRequest } from '../models/sign-up.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
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

    updateUser(body: SignUpRequest): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/user`, body, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }
}
