import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { environment } from "src/environments/environment";
import { ReportType } from "../models/report-type.model";

@Injectable({
    providedIn: 'root'
})
export class ReportTypeService {
    constructor(
        private _httpClient: HttpClient
    ) {}

    getAll(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/report-type`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    getAllReportTypeREP(): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/report-type/rep`);
    }

    getAllReportTypeFR(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/report-type/fp`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    create(body: ReportType): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/report-type`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    update(body: ReportType): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/report-type`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    delete(id: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/report-type/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }
}