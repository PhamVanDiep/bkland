import { Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AppUpdateService {
    private reload: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private _swUpdate: SwUpdate) {
    }

    get reload$(): Observable<boolean> {
        return this.reload.asObservable();
    }

    update(): void {
        this._swUpdate.versionUpdates
            .subscribe((response: any) => {
                switch (response.type) {
                    case 'VERSION_DETECTED':
                        if (confirm('Đã tìm thấy phiên bản mới. Bạn có muốn cập nhật?')) {
                            this.reload.next(true);
                        } else {
                            this.reload.next(true);
                        }
                        break;
                    case 'VERSION_READY':
                        console.log(`Current app version: ${response.currentVersion.hash}`);
                        console.log(`New app version ready for use: ${response.latestVersion.hash}`);
                        break;
                    case 'VERSION_INSTALLATION_FAILED':
                        console.log(`Failed to install app version '${response.version.hash}': ${response.error}`);
                        break;
                    default:
                        break;
                }
            })
    }
}