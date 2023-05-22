import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    constructor(
        private _httpClient: HttpClient
    ) {
    }

    getAllPaidByUserId(userId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/payment/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getAllPostPay(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/payment/post-pay`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    getAllSpecialAccountPay(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/payment/special-account-pay`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }
}