import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    constructor(
        private _httpClient: HttpClient
    ) {}

    create(body: any): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/project`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    update(body: any): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/project`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    deleteParam(id: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/project/param/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    deleteProject(id: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/project/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    findAll(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/project`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    findByUser(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/project/user`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    findByType(page: number, pageSize: number, type: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/project/type?page=${page}&pageSize=${pageSize}&type=${type}`);
    }

    increaseView(id: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/project/increase-view/${id}`);
    }

    findById(id: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/project/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    anonymousInterested(body: any): Observable<APIResponse> {
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_NO_AUTH}/project/interested`, body);
    }

    userInterested(body: any): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/project/interested`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    isInterested(userId: string, projectId: string, deviceInfo: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/project/isInterested?userId=${userId}&deviceInfo=${deviceInfo}&projectId=${projectId}`);
    }

    statistic(id: number, year: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/project/statistic?id=${id}&year=${year}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }
}