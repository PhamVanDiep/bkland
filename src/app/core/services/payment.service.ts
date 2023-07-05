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

    thanhToanNam(nam: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/payment/statistic/thanh-toan-nam?nam=${nam}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    thanhToanThang(thang: number, nam: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/payment/statistic/thanh-toan-thang?nam=${nam}&thang=${thang}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    napTienNam(nam: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/payment/statistic/nap-tien-nam?nam=${nam}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    napTienThang(thang: number, nam: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/payment/statistic/nap-tien-thang?nam=${nam}&thang=${thang}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }
}