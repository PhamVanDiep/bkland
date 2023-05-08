import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { MenuItem, MessageService } from 'primeng/api';
import { ReplaySubject, ignoreElements, takeUntil } from 'rxjs';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import { UserDeviceToken } from 'src/app/core/models/user-device-token.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-administration-layout',
  templateUrl: './administration-layout.component.html',
  styleUrls: ['./administration-layout.component.css']
})
export class AdministrationLayoutComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  loading: boolean = false;
  items: MenuItem[];
  menuItems: MenuItem[];
  avatarUrl: string;
  user: SignUpRequest;
  roles: string[];
  deviceInfo: DeviceInfo;
  sidebarVisible: boolean;
  innerWidth: any;
  sidebarItems: MenuItem[];
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1024) {
      this.sidebarVisible = false;
    } else {
      this.sidebarVisible = true;
    }
  }

  constructor(
    private _router: Router,
    private _loadingService: LoadingService,
    private _userService: UserService,
    private _messageService: MessageService,
    private _authService: AuthService,
    private _deviceDetectorService: DeviceDetectorService,
  ) {
    this.avatarUrl = '/assets/images/user.png';
    this.roles = localStorage.getItem('roles')?.split(',') || [];
    if (this.roles.length <= 0) {
      this._router.navigate(['/home']);
    }
    if (this.roles.includes(ROLE.ROLE_USER)
      || this.roles.includes(ROLE.ROLE_AGENCY)
      || this.roles.includes(ROLE.ROLE_ENTERPRISE)) {
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
    } else {
      this.menuItems = [];
    }
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
    this.innerWidth = window.innerWidth;
    this.innerWidth < 1024 ? this.sidebarVisible = false : this.sidebarVisible = true;

    // if (this.roles.includes(ROLE.ROLE_USER)) {
    // if (true) {
    if (this.roles.includes(ROLE.ROLE_USER)) {
      this.sidebarItems = [
        {
          label: 'Bài đăng quan tâm',
          icon: 'pi pi-heart-fill',
        },
        {
          label: 'Quản lý bài viết',
          icon: 'pi pi-list',
          items: [
            {
              label: 'Bài viết bán/cho thuê'
            },
            {
              label: 'Bài viết cộng đồng'
            }
          ]
        },
        {
          label: 'Quản lý tài chính',
          icon: 'pi pi-chart-line',
          items: [
            {
              label: 'Nạp tiền',
            },
            {
              label: 'Lịch sử giao dịch'
            }
          ]
        },
        {
          label: 'Thông báo BĐ giá',
          icon: 'pi pi-bell'
        },
        {
          label: 'Nhắn tin',
          icon: 'pi pi-comments'
        },
        {
          label: 'Liên kết môi giới',
          icon: 'pi pi-users'
        },
        {
          label: 'Quản lý tài khoản',
          icon: 'pi pi-user'
        }
      ]
    }
    if (this.roles.includes(ROLE.ROLE_ADMIN)) {
      this.sidebarItems = [
        {
          label: 'Thống kê',
          icon: 'pi pi-th-large'
        },
        {
          label: 'Quản lý bài viết',
          icon: 'pi pi-list',
          items: [
            {
              label: 'Bài viết bán/cho thuê'
            },
            {
              label: 'Bài viết cộng đồng'
            },
            {
              label: 'Bài viết tin tức'
            }
          ]
        },
        {
          label: 'Quản lý tài khoản người dùng',
          icon: 'pi pi-user'
        },
        {
          label: 'Quản lý báo cáo bài viết',
          icon: 'pi pi-exclamation-triangle'
        },
        {
          label: 'Quản lý giao dịch tài chính',
          icon: 'pi pi-chart-line'
        },
        {
          label: 'Nhắn tin với người dùng',
          icon: 'pi pi-comments'
        },
        {
          label: 'Quản lý thông tin hệ thống',
          icon: 'pi pi-info-circle'
        }
      ]
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading$
      .subscribe((response: boolean) => {
        this.loading = response;
      });

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
      });

    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
  }

  navigatePage(path: string): void {
    this._router.navigate([path]);
  }

  enableSideBar(): boolean {
    if (this.innerWidth < 1024) {
      return true;
    }
    return false;
  }

  sidebarModal(): boolean {
    if (this.innerWidth < 1024) {
      return true
    }
    return false;
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
