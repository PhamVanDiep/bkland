import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PostReport } from "../models/post-report.model";
import { Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PostReportService {
    constructor(
        private _httpClient: HttpClient
    ) {}

    create(body: PostReport): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/post-report`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }
}