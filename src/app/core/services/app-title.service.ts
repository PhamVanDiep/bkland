import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Injectable({
    providedIn: 'root'
})
export class AppTitleService {
    constructor(private _title: Title) {
    }

    setTitle(title: string): void {
        this._title.setTitle(title);
    }
}