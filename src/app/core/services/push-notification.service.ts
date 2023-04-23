import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationMessage } from "../models/message.model";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "src/environments/environment";
import { Observable, ReplaySubject } from "rxjs";
import { UserToken } from "../models/user-token.model";

@Injectable({
    providedIn: 'root'
})
export class PushNotificationService {
    private pushNotifyToken: ReplaySubject<string> = new ReplaySubject<string>();
    private message: ReplaySubject<any> = new ReplaySubject<any>();
    private PN_FIREBASE_URL: string = 'https://fcm.googleapis.com/fcm/send';
    private FCM_KEY: string = 'AAAA6jZuRHA:APA91bGh0Ji9Gx0sXjQ38v4um54ofTP4eWyn2WBdOC7vqV9GO_sacXotS6FWL1aQdZK0dWK97dOaQFUm9zsqOiA_MNOS9_yPC30QyYR9dN0ckaER-MqImSLJGvi7vIXA7erI5U--WO5N';

    constructor(private _httpClient: HttpClient){}

    notify(message: NotificationMessage, userTokens: UserToken[]): void {
        userTokens.forEach(e => {
            if (e.active) {
                this._httpClient.post(`${this.PN_FIREBASE_URL}`, {
                    notification: {
                        title: message.content
                    },
                    to: e.token
                }, { headers: {
                    'Authorization': `key=${this.FCM_KEY}`
                } }).subscribe((response: any) => {

                });   
            }
        });
    }

    get pushNotifyToken$(): Observable<string> {
        return this.pushNotifyToken.asObservable();
    }

    get message$(): Observable<any> {
        return this.message.asObservable();
    }

    requestPermission(): void {
        const messaging = getMessaging();
        
        getToken(messaging, { vapidKey: environment.FirebaseConfig.vapidKey })
            .then((currentToken: any) => {
                if (currentToken) {
                    this.pushNotifyToken.next(currentToken);
                } else {
                    
                }
            })
            .catch((error: any) => {

            })
    }

    listen(): void {
        const messaging = getMessaging();
        onMessage(messaging, (payload: any) => {
            this.message.next(payload);
        })
    }

    getAllUserToken(): Observable<UserToken[]> {
        return this._httpClient.get<UserToken[]>(`${environment.PUSH_NOTIFY_BASE_URL}/userToken`);
    }

    getUserToken(userToken: UserToken): Observable<UserToken> {
        let requestParams = new HttpParams()
                .set('userId', userToken.userId)
                .set('deviceInfo', userToken.deviceInfo);
        return this._httpClient.get<UserToken>(`${environment.PUSH_NOTIFY_BASE_URL}/userToken/getByUserIdAndDeviceInfo`, 
                                                { params: requestParams });
    }

    addUserToken(userToken: UserToken): Observable<UserToken> {
        return this._httpClient.post<UserToken>(`${environment.PUSH_NOTIFY_BASE_URL}/userToken`, userToken);
    }

    updateUserToken(userToken: UserToken): Observable<UserToken> {
        return this._httpClient.put<UserToken>(`${environment.PUSH_NOTIFY_BASE_URL}/userToken`, userToken);
    }
}