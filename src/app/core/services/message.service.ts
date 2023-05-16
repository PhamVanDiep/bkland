import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private _message: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    get message$(): Observable<boolean> {
        return this._message.asObservable();
    }

    constructor(
    ) { }

    // add(status: any): void {
    //     this._message.next(status);
    // }

    successMessage(message: string): void {
        this._message.next({ severity: 'success', summary: 'Thông báo', detail: message });
    }

    warningMessage(message: string): void {
        this._message.next({ severity: 'warn', summary: 'Thông báo', detail: message });
    }

    errorMessage(message: string): void {
        this._message.next({ severity: 'error', summary: 'Thông báo', detail: message });
    }

    infoMessage(message: string): void {
        this._message.next({ severity: 'info', summary: 'Thông báo', detail: message });
    }
}
