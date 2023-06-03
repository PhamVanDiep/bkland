import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ReplaySubject, takeUntil } from 'rxjs';
import { NOTIFY_BEFORE } from 'src/app/core/constants/other.constant';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { EnablePFRequest, PriceFluctuationResponse } from 'src/app/core/models/price-fluctuation.model';
import { SpecialAccount } from 'src/app/core/models/special-account.model';
import { UserDeviceToken } from 'src/app/core/models/user-device-token.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PriceFluctuationService } from 'src/app/core/services/price-fluctuation.service';
import { PushNotificationService } from 'src/app/core/services/push-notification.service';
import { SpecialAccountService } from 'src/app/core/services/special-account.service';
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

  pfEnable: boolean;
  response: PriceFluctuationResponse;
  isRegistered: boolean;

  isUser: boolean;
  isSpecialAccount: boolean;

  lstNotifyBefore: any[];
  specialAccount: SpecialAccount;

  userId: string;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _deviceDetectorService: DeviceDetectorService,
    private _pushNotificationService: PushNotificationService,
    private _userDeviceTokenService: UserDeviceTokenService,
    private _priceFluctuationService: PriceFluctuationService,
    private _specialAccountService: SpecialAccountService
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
    };
    this.pfEnable = false;
    this.isRegistered = false;
    let _roles = localStorage.getItem('roles')?.split(',');
    if (_roles?.includes(ROLE.ROLE_USER)) {
      this.isUser = true;
    } else {
      this.isUser = false;
    }

    if (_roles?.includes(ROLE.ROLE_AGENCY) || _roles?.includes(ROLE.ROLE_ENTERPRISE)) {
      this.isSpecialAccount = true;
    } else {
      this.isSpecialAccount = false;
    }
    this.lstNotifyBefore = NOTIFY_BEFORE;
    this.specialAccount = {
      agency: false,
      lastPaid: null,
      monthlyCharge: 0,
      notifyBefore: 7,
      userId: ''
    };
    this.userId = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
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

    this._priceFluctuationService.findByUserId(_id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.response = response.data;
          this.pfEnable = this.response.enable;
          this.isRegistered = true;
        } else {
          if (response.status === HttpStatusCode.InternalServerError) {
            this._messageService.errorMessage(response.message); 
          }
        }
      });

    if (this.isSpecialAccount) {
      this._specialAccountService.findById(this.userId)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.specialAccount = response.data;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
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

  updatePriceFluctuationEnable(): void {
    let body: EnablePFRequest = {
      enable: this.pfEnable,
      userId: this.userId
    }
    this._priceFluctuationService.enable(body)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  updateSpecialAccount(): void {
    this._specialAccountService.updateSpecialAccount(this.specialAccount)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }
}
