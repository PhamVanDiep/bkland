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
}
