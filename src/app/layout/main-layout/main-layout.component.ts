import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { MenuItem, MessageService } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { About } from 'src/app/core/models/about.model';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import { UserDeviceToken } from 'src/app/core/models/user-device-token.model';
import { AboutService } from 'src/app/core/services/about.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy{
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  items: MenuItem[];
  isAuth: boolean;
  avatarIcon: string;
  user: SignUpRequest;
  avatarUrl: string;
  menuItems: MenuItem[];
  loading: boolean = false;
  deviceInfo: DeviceInfo;
  noInterestedPost: string;
  about: About;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService,
    private _messageService: MessageService,
    private _loadingService: LoadingService,
    private _deviceDetectorService: DeviceDetectorService,
    private _aboutService: AboutService
  ) {
    this.items = [
      {
        label: "Mua bán",
        // routerLink: '/mua-ban',
        command: () => this.navigatePage('/mua-ban'),
        items: [
          {
            label: "Nhà đất",
            // routerLink: '/nha-dat',
            command: () => this.navigatePage('/nha-dat')
          },
          {
            label: "Chung cư",
            routerLink: '/chung-cu'
          },
          {
            label: "Đất nền",
            routerLink: '/dat-nen'
          }
        ]
      },
      {
        label: "Cho thuê",
        routerLink: '/cho-thue',
        items: [
          {
            label: "Nhà đất",
            routerLink: '/nha-dat'
          },
          {
            label: "Chung cư",
            routerLink: '/chung-cu'
          },
          {
            label: "Đất nền",
            routerLink: '/dat-nen'
          }
        ]
      },
      {
        label: "Cộng đồng",
        routerLink: '/cong-dong'
      },
      {
        label: "Tiện ích",
        routerLink: '/tien-ich',
        items: [
          {
            label: "Dự án",
            routerLink: '/du-an'
          },
          {
            label: "Tin tức",
            routerLink: '/tin-tuc'
          },
          {
            label: "Phong thủy",
            routerLink: '/phong-thuy'
          },
          {
            label: "Quy định",
            routerLink: '/quy-dinh'
          },
          {
            label: "Hướng dẫn",
            routerLink: "/huong-dan"
          }
        ]
      }
    ];
    this.isAuth = false;
    this.avatarIcon = "pi pi-user";
    this.avatarUrl = '/assets/images/user.png';
    this.menuItems = [
      {
        label: 'Quản lý tài khoản',
        icon: 'pi pi-list',
        command: () => {
          
        }
      },
      {
        label: 'Đổi mật khẩu',
        icon: 'pi pi-lock',
        command: () => {

        }
      },
      {
        label: 'Đăng xuất',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];
    this.noInterestedPost = '0';
    this.about = {
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
      id: 0,
      createAt: null,
      createBy: '',
      updateAt: null,
      updateBy: ''
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this.isAuth = this._authService.isAuthenticated();
    this._loadingService.loading$
      .subscribe((response: boolean) => {
        this.loading = response;
      });

    if (this.isAuth) {
      this._userService.getUserById()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          // console.log(response);
          if (response.status === HttpStatusCode.Ok) {
            this.user = response.data;
            if (response.data.avatarUrl != undefined && response.data.avatarUrl != null && response.data.avatarUrl.length > 0) {
              this.avatarUrl = response.data.avatarUrl; 
            }
          } else {
            this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
          }
        })
    }

    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();

    this._aboutService.getAboutInfo()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.about = response.data;
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }

  navigatePage(path: string): void {
    this._router.navigate([path]);
  }

  logout(): void {
    let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    let logoutRequest: UserDeviceToken = {
      id: 0,
      userId: _id,
      deviceInfo: this.deviceInfo.userAgent,
      enable: true,
      logout: true,
      notifyToken: '',
      createBy: '',
      createAt: null,
      updateBy: _id,
      updateAt: null
    }
    // console.log(logoutRequest);
    this._authService.logout(logoutRequest)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          localStorage.clear();
          this.navigatePage('/login');
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      });
  }
}
