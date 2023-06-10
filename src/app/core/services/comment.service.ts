import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { BehaviorSubject, Observable } from "rxjs";
import { APIResponse } from "../models/api-response.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Comment } from "../models/comment.model";

@Injectable({
    providedIn: 'root'
})
export class CommentService extends BaseService {
    private _comment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _postId: BehaviorSubject<string> = new BehaviorSubject<string>('');

    get comment$(): Observable<boolean> {
        return this._comment.asObservable();
    }

    showComment(): void {
        this._comment.next(true);
    }

    hideComment(): void {
        this._comment.next(false);
    }
    get postId$(): Observable<string> {
        return this._postId.asObservable();
    }

    setPostId(postId: string): void {
        this._postId.next(postId);
    }

    constructor(
        private _httpClient: HttpClient
    ) {
        super();
        this.accessToken = localStorage.getItem('accessToken') || '';
    }

    findAllByPostId(postId: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/post-comment/all/${postId}`);
    }

    noAuthCreate(body: Comment): Observable<APIResponse> {
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_NO_AUTH}/post-comment`, body);
    }

    authCreate(body: Comment): Observable<APIResponse> {
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/post-comment`, body, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }

    update(body: Comment): Observable<APIResponse> {
        return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/post-comment`, body, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }

    delete(id: number): Observable<APIResponse> {
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/post-comment/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })
    }
}