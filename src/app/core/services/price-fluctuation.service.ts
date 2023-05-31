import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { environment } from "src/environments/environment";
import { EnablePFRequest, PriceFluctuationRequest } from "../models/price-fluctuation.model";

@Injectable({
    providedIn: 'root'
})
export class PriceFluctuationService {

    constructor(
        private _httpClient: HttpClient
    ) {}

    findByUserId(userId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/price-fluctuation/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    insert(body: PriceFluctuationRequest): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/price-fluctuation`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    update(body: PriceFluctuationRequest): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/price-fluctuation`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    unregister(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/price-fluctuation`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    enable(body: EnablePFRequest): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/price-fluctuation/enable`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }
}