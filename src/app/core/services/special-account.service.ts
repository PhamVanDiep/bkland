import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { APIResponse } from "../models/api-response.model";
import { SpecialAccount } from "../models/special-account.model";

@Injectable({
    providedIn: 'root'
})
export class SpecialAccountService {
    constructor(
        private _httpClient: HttpClient
    ) {}

    agencySignUp(body: any): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/special-account/agency`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    agencyUpdate(body: any): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/special-account/agency`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    agencyDelete(userId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/special-account/agency/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    agencyInfo(userId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/special-account/agency/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    findById(userId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/special-account/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    updateSpecialAccount(specialAccount: SpecialAccount): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/special-account`, specialAccount, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    listAgencyByRepDistrict(repId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/special-account/rep/${repId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }
}