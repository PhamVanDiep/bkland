import { Injectable } from "@angular/core";
import { RealEstatePostAgency } from "../models/real-estate-post-agency.model";
import { Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class RealEstatePostAgencyService {
    constructor(
        private _httpClient: HttpClient
    ) {}

    create(body: any): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post-agency`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    update(body: RealEstatePostAgency): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post-agency`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    delete(id: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post-agency/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }
}