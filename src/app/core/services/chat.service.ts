import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChatRoom, Message } from "../models/chat.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { APIResponse } from "../models/api-response.model";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(
        private _httpClient: HttpClient
    ) {}

    createChatRoom(chatRoom: ChatRoom): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/chat/chat-room`, chatRoom, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    chatRoomDetail(id: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/chat/chat-room/detail/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    deleteChatRoom(id: number): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.delete<APIResponse>(`${environment.BASE_URL_AUTH}/chat/chat-room/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    findChatRoomByUser(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/chat/chat-room/user`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    createMessage(message: Message): void {
        let accessToken = localStorage.getItem('accessToken') || '';
        this._httpClient.post<APIResponse>(`${environment.BASE_URL_AUTH}/chat/message`, message, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).subscribe();
    }

    createaAnonymousMessage(message: Message): void {
        this._httpClient.post<APIResponse>(`${environment.BASE_URL_NO_AUTH}/chat/message`, message).subscribe();
    }

    getChatUserEnable(): Observable<APIResponse> {
        let accessToken = localStorage.getItem('accessToken') || '';
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_AUTH}/chat/user/enable`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    findAnonymousChatRoom(userDeviceId: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/chat/chat-room?userDeviceId=${userDeviceId}`);
    }

    getAnonymousChatRoomDetail(id: number, userDeviceId: string): Observable<APIResponse> {
        return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/chat/chat-room/detail?id=${id}&userDeviceId=${userDeviceId}`);
    }
}