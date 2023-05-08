import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';

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
}
