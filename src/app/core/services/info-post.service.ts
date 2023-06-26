import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { environment } from "src/environments/environment";
import { InfoPost } from "../models/info-post.model";

@Injectable({
    providedIn: 'root'
})
export class InfoPostService {
    constructor(
        private _httpClient: HttpClient
    ) {}

    getAll(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/info-post`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    create(body: any): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/info-post`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    update(body: InfoPost): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/info-post`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    findById(id: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/info-post/${id}`);
    }

    findByIdWithIncreaseView(id: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/info-post/user-view/${id}`);
    }

    findByUserId(userId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/info-post/enterprise/${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    delete(id: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/info-post/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    findByInfoType(id: number): Observable<any> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/info-post/info-type/${id}`);
    }

    getHomePagePosts(): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/info-post/homepage`);
    }

    getHomePageDuAnPosts(): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/info-post/homepage-du-an`);
    }

    countByInfoType(infoTypeId: number): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/info-post/countByInfoType?infoTypeId=${infoTypeId}`);
    }

    loadMore(infoTypeId: number, limit: number, page: number): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/info-post/load-more?infoTypeId=${infoTypeId}&limit=${limit}&page=${page}`);
    }
}