import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';
import { Charge } from '../models/charge.model';

@Injectable({
    providedIn: 'root'
})
export class ChargeService {
    private accessToken: string;

    constructor(private _httpClient: HttpClient) {}

    createCharge(charge: Charge): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/charge`, charge, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    updateCharge(charge: Charge): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/charge`, charge, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    getVnpayUrl(ipAddress: string, userId: string, amount: number): Observable<any> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<any>(`${environment.BASE_URL_AUTH}/charge/vnpay-url/${ipAddress}/${userId}/${amount}`,
        {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    getAllCharge(): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/charge`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }

    getChargeByUserId(): Observable<APIResponse> {
        let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/charge/${_id}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }
}