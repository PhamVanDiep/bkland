import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    private accessToken: string;

    constructor(
        private _httpClient: HttpClient
    ) { 
    }

    postImage(body: any): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/photos`, body,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );
    }

    getImage(id: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/photos/${id}`);
    }
}
