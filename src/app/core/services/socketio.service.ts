import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { io } from "socket.io-client";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SocketioService {
    private _message: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private _newRep: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    get message$(): Observable<any> {
        return this._message.asObservable();
    }

    get getNewRep$(): Observable<any> {
        return this._newRep.asObservable();
    }

    socket: any;

    constructor() {}

    connect(): void {
        this.socket = io(environment.SOCKET_ENDPOINT);
    }

    joinConversation(id: number): void {
        this.socket.emit("joinConversation", id);
    }

    leaveConversation(id: number): void {
        if (this.socket) this.socket.emit("leaveConversation", id);
    }

    sendMessage(message: any): void {
        this.socket.emit("sendMessage", message);
    }

    receiveMessage(): void {
        this.socket.on("newMessageSent", (data: any) => {
            this._message.next(data);
        })
    }

    joinNewRepConversation(): void {
        this.socket.emit("joinConversation", "newRepId");
    }

    leaveNewRepConversation(): void {
        if (this.socket) this.socket.emit("leaveConversation", "newRepId");
    }

    sendNewRep(rep: any): void {
        this.socket.emit("newRep", rep);
    }

    receiveNewRep(): void {
        this.socket.on("newRepReceiver", (data: any) => {
            console.log(data);
            this._newRep.next(data);
        })
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}