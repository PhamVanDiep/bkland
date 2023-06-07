import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ForumPost } from "../models/forum-post.model";
import { Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ForumPostService {
    constructor(
        private _httpClient: HttpClient
    ) {}

    create(body: ForumPost): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/forum-post`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    update(body: ForumPost): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/forum-post`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    findById(id: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/forum-post/${id}`);
    }

    findByUser(page: number, pageSize: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/forum-post/createBy?page=${page}&pageSize=${pageSize}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    getAllPageable(page: number, pageSize: number) {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/forum-post?page=${page}&pageSize=${pageSize}`);
    }

    isLiked(postId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/forum-post/liked/${postId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }) 
    }

    like(body: any): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/forum-post/like`, body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    getLog(postId: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/forum-post/log/${postId}`);
    }

    deletePost(postId: string): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/forum-post/${postId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    findOfUsers(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/forum-post/user`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }
}