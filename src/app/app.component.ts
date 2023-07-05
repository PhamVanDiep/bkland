import { Component, OnInit } from '@angular/core';
import { AppUpdateService } from './core/services/app-update.service';
import { MessageService } from 'primeng/api';
import { LoadingService } from './core/services/loading.service';
import { MessageService as MessageServiceCustomize } from './core/services/message.service';
import { PushNotificationService } from './core/services/push-notification.service';
import { SwUpdate } from '@angular/service-worker';
import { getMessaging, onMessage } from 'firebase/messaging';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading: boolean = false;

  constructor(
    // private _appUpdateService: AppUpdateService,
    private _swUpdate: SwUpdate,
    private _messageService: MessageService,
    private _messageServiceCustomize: MessageServiceCustomize,
    public _loadingService: LoadingService,
    public _pushNotifyService: PushNotificationService
  ) {
    // this._appUpdateService.update();
  }

  ngOnInit(): void {
    // this._appUpdateService.reload$
    //   .subscribe((response: boolean) => {
    //     if (response) {
    //       this.reload();
    //     }
    //   });

    this._swUpdate.versionUpdates
      .subscribe((response: any) => {
        switch (response.type) {
          case 'VERSION_DETECTED':
            if (confirm('Đã tìm thấy phiên bản mới. Bạn có muốn cập nhật?')) {
              this.reload();
            } else {
              this.reload();
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
      });

    this._loadingService.loading$
      .subscribe((response: boolean) => {
        this.loading = response;
      });

    this._messageServiceCustomize.message$
      .subscribe((response: any) => {
        this._messageService.clear();
        this._messageService.add(response);
      });

    const messaging = getMessaging();
    onMessage(messaging, (payload: any) => {
      console.log(payload);
    })
    // this._pushNotifyService.listen();
    // this._pushNotifyService.message$
    //   .subscribe((response: any) => {
    //     console.log(response);
    //   })
  }

  reload(): void {
    this._messageServiceCustomize.infoMessage('Đã cài đặt phiên bản mới, hệ thống sẽ tải lại sau 5s');
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
}
