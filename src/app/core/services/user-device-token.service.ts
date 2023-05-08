import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';
import { UserDeviceToken } from '../models/user-device-token.model';

@Injectable({
    providedIn: 'root'
})
export class UserDeviceTokenService {
    private accessToken: string;

    constructor(
        private _httpClient: HttpClient
    ) { 
        this.accessToken = localStorage.getItem('accessToken') || '';
    }

    createUserDeviceToken(body: UserDeviceToken): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/user-device-token`, 
                body,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                });
    }
}
