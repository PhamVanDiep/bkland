import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private _loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    get loading$(): Observable<boolean> {
        return this._loading.asObservable();
    }

    constructor(
    ) { }

    loading(status: boolean): void {
        this._loading.next(status);
    }
}
