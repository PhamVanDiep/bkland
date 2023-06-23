import { Component, OnInit } from '@angular/core';
import { AppUpdateService } from './core/services/app-update.service';
import { MessageService } from 'primeng/api';
import { LoadingService } from './core/services/loading.service';
import { MessageService as MessageServiceCustomize } from './core/services/message.service';
import { PushNotificationService } from './core/services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading: boolean = false;

  constructor(
    private _appUpdateService: AppUpdateService,
    private _messageService: MessageService,
    private _messageServiceCustomize: MessageServiceCustomize,
    public _loadingService: LoadingService,
    public _pushNotifyService: PushNotificationService
  ) {
    this._appUpdateService.update();
  }

  ngOnInit(): void {
    this._appUpdateService.reload$
      .subscribe((response: boolean) => {
        if (response) {
          this.reload();
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
    this._pushNotifyService.listen();
    this._pushNotifyService.message$
      .subscribe((response: any) => {
        console.log(response);
      })
  }

  reload(): void {
    this._messageServiceCustomize.infoMessage('Đã cài đặt phiên bản mới, hệ thống sẽ tải lại sau 5s');
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
}
