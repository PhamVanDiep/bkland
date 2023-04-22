import { Component, OnInit } from '@angular/core';
import { AppTitleService } from './core/services/app-title.service';
import { AppUpdateService } from './core/services/app-update.service';
import { PushNotificationService } from './core/services/push-notification.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { UserToken } from './core/models/user-token.model';
import { MessageService } from 'primeng/api';
import { NotificationMessage } from './core/models/message.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'bkland-fe';
  deviceInfo: DeviceInfo;
  userToken: UserToken;
  userTokens: UserToken[];

  constructor(
    private _appTitleService: AppTitleService,
    private _appUpdateService: AppUpdateService,
    private _pushNotificationService: PushNotificationService,
    private _deviceDetectorService: DeviceDetectorService,
    private _messageService: MessageService
  ) {
    // this._appTitleService.setTitle("Hello world");
    this._appUpdateService.update();
    this.userToken = {
      id: 0,
      userId: 'dieppv',
      deviceInfo: '',
      token: '',
      active: false
    };
  }

  ngOnInit(): void {
    this._appUpdateService.reload$
      .subscribe((response: boolean) => {
        if (response) {
          this.reload();
        }
      });
    
    this._pushNotificationService.getAllUserToken()
      .subscribe((response: UserToken[]) => {
        if (response) {
          this.userTokens = response; 
        }
      });

    this._pushNotificationService.pushNotifyToken$
      .subscribe((response: string) => {
        console.log(response);
        if (response) {
          let userToken: UserToken = {
            id: 0,
            userId: 'dieppv',
            token: response,
            deviceInfo: this.deviceInfo.userAgent,
            active: true
          }
          this._pushNotificationService.addUserToken(userToken)
            .subscribe((response: UserToken) => {
              if (response) {
                this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: `Đăng ký nhận thông báo thành công: ${response.id}` });  
              } else {
                this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: `Đã đăng ký nhận thông báo trước đó` });
              }
            })
        }
      });

    this._pushNotificationService.message$
      .subscribe((response: any) => {
        console.log(response);
      });

    // this.epicFunction();
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
    this.userToken.deviceInfo = this.deviceInfo.userAgent;

    this._pushNotificationService.getUserToken(this.userToken)
      .subscribe((response: UserToken) => {
        if (response) {
          this.userToken = response; 
        }
      });
  }

  reload(): void {
    // this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Đã cài đặt phiên bản mới, hệ thống sẽ tải lại sau 5s' });
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  subscribe(): void {
    if (this.userToken.id >= 0) {
      this._pushNotificationService.updateUserToken(this.userToken)
        .subscribe((response: UserToken) => {
          this.userToken = response;
        });
    } else {
      if (this.userToken.active) {
        this._pushNotificationService.requestPermission();
      }
    }
  }

  notify(): void {
    let message: NotificationMessage = {
      content: 'Hey guy. This is notification for you and all subscribers'
    }
    this._pushNotificationService.notify(message, this.userTokens);
  }

  epicFunction() {
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
    const isMobile = this._deviceDetectorService.isMobile();
    const isTablet = this._deviceDetectorService.isTablet();
    const isDesktopDevice = this._deviceDetectorService.isDesktop();
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  }
}
