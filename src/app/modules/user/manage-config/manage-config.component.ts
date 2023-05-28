import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { UserDeviceToken } from 'src/app/core/models/user-device-token.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PushNotificationService } from 'src/app/core/services/push-notification.service';
import { UserDeviceTokenService } from 'src/app/core/services/user-device-token.service';

@Component({
  selector: 'app-manage-config',
  templateUrl: './manage-config.component.html',
  styleUrls: ['./manage-config.component.css']
})
export class ManageConfigComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Cài đặt';

  deviceInfo: DeviceInfo;
  userDeviceToken: UserDeviceToken;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _deviceDetectorService: DeviceDetectorService,
    private _pushNotificationService: PushNotificationService,
    private _userDeviceTokenService: UserDeviceTokenService
  ) {
    this._appTitleService.setTitle(this.title);

    this.userDeviceToken = {
      id: 0,
      deviceInfo: '',
      enable: false,
      logout: false,
      notifyToken: '',
      userId: '',
      createBy: '',
      createAt: null,
      updateBy: '',
      updateAt: null
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this._loadingService.loading(true);
    let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();

    this._userDeviceTokenService
      .getUserDeviceToken(_id, this.deviceInfo.userAgent)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.userDeviceToken = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    this._pushNotificationService.pushNotifyToken$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: string) => {
        this.userDeviceToken.notifyToken = response;
        this.sendUpdateUserDeviceTokenRequest();
      });
  }

  updateUserDeviceToken(): void {
    if (this.userDeviceToken.enable && this.userDeviceToken.notifyToken.length == 0) {
      this._pushNotificationService.requestPermission();
    } else {
      this.sendUpdateUserDeviceTokenRequest();
    }
  }

  sendUpdateUserDeviceTokenRequest(): void {
    this.userDeviceToken.updateBy = this.userDeviceToken.userId;
    this._userDeviceTokenService.updateUserDeviceToken(this.userDeviceToken)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {

        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }
}
