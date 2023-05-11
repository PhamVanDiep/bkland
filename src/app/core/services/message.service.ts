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

    add(status: any): void {
        this._message.next(status);
    }
}
