import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { environment } from "src/environments/environment";
import { InfoType } from "../models/info-type.model";

@Injectable({
    providedIn: 'root'
})
export class InfoTypeService {
    constructor(
        private _httpClient: HttpClient
    ) {}

    getAllSkip(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/info-type/skip`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getAll(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/info-type`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    create(body: InfoType): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/info-type`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    update(body: InfoType): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/info-type`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    delete(id: number): Observable<any> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/info-type/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    findById(id: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/info-type/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }
}