import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { NotificationMessage } from "../models/message.model";

@Injectable({
    providedIn: 'root'
})
export class PushNotificationService {
    constructor(private _httpClient: HttpClient){}

    notify(message: NotificationMessage): void {
        
    }
}