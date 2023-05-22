import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RealEstatePostService {
    private accessToken: string;

    constructor(
        private _httpClient: HttpClient
    ) { 
        this.accessToken = localStorage.getItem('accessToken') || '';
    }

    // createPost(body: any, type: string): Observable<APIResponse> {
    //     this.accessToken = localStorage.getItem('accessToken') || '';
    //     return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/${type.toLowerCase()}`, body,
    //         {
    //             headers: {
    //                 'Authorization': `Bearer ${this.accessToken}`
    //             }
    //         }
    //     );
    // }
    createPost(body: any): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post`, body,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    getPostById(id: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/real-estate-post/${id}`);
    }

    updatePost(body: any): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post`, body,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    getPostdByOwnerId(): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/user/${_id}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    disablePost(postId: string): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/disable/${postId}`, null, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }

    getAllPost(): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/all`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }

    disableOrEnablePost(id: string): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/enable/${id}`, null,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    updatePostStatus(body: any): Observable<any> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/real-estate-post/status`, body,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }
}
