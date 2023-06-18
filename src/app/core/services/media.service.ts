import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    private _avatar: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private accessToken: string;

    get avatar$(): Observable<any> {
        return this._avatar.asObservable();
    }

    setAvatar(avatar: any): void {
        this._avatar.next(avatar);
    }
    
    constructor(
        private _httpClient: HttpClient,
        private _domSanitizer: DomSanitizer
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

    retriveImage(path: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(path);
    }

    getImgSrc(base64: any) {
        return this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${base64.type};base64,${base64.body}`);
    }

    deletePhotoByPostId(postId: string): Observable<APIResponse> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/photos/${postId}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    deleteById(id: string): Observable<any> {
        this.accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/photos/photo/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }
}
