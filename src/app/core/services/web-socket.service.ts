import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private _message: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    get message$(): Observable<any> {
        return this._message.asObservable();
    }

    setMessage(message: any): void {
        this._message.next(message);
    }

    webSocketEndPoint: string = 'http://localhost:7979/ws';
    topic: string = "/topic/chat";
    stompClient: any;

    constructor() {}

    _connect() {
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame: any) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent: any) {
                _this.setMessage(JSON.parse(sdkEvent.body));
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error: any) {
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

    /**
     * Send message to sever via web socket
     * @param {*} message 
     */
    _send(message: any) {
        this.stompClient.send("/app/chat", {}, JSON.stringify(message));
    }
}