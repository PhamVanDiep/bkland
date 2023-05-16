import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { MenuItem } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { EMAIL_VERIFY_TYPE } from 'src/app/core/constants/email-verify.constant';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { EmailVerify } from 'src/app/core/models/email-verify.model';
import { ForgotPasswordChange } from 'src/app/core/models/forgot-password-change.model';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import { UserDeviceToken } from 'src/app/core/models/user-device-token.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administration-layout',
  templateUrl: './administration-layout.component.html',
  styleUrls: ['./administration-layout.component.css']
})
export class AdministrationLayoutComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  // loading: boolean = false;
  items: MenuItem[];
  menuItems: MenuItem[];
  avatarUrl: any;
  user: SignUpRequest;
  roles: string[];
  deviceInfo: DeviceInfo;
  sidebarVisible: boolean;
  innerWidth: any;
  sidebarItems: MenuItem[];
  
  emailVerify: string;
  displayChangePassword: boolean;
  newPassword: string;
  newPasswordAgain: string;
  verifyOTP: string;
  responseOTP: string;

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
    private _noAuthService: NoAuthService,
    private _mediaService: MediaService,
    private _domSanitizer: DomSanitizer
  ) {
    this.avatarUrl = '/assets/images/user.png';
    this.roles = localStorage.getItem('roles')?.split(',') || [];
    if (this.roles.length <= 0) {
      this._router.navigate(['pages/forbidden']);
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
          if (this.roles.includes('ROLE_ADMIN')) {
            this.navigatePage('admin');
          } else {
            this.navigatePage('user');
          }
        }
      },
      {
        label: 'Đổi mật khẩu',
        icon: 'pi pi-lock',
        command: () => {
          this.changePasswordFunc();
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
          routerLink: 'user/focus'
        },
        {
          label: 'Quản lý bài viết',
          icon: 'pi pi-list',
          routerLink: 'user/post',
          items: [
            {
              label: 'Bài viết bán/cho thuê',
              routerLink: 'user/post/main'
            },
            {
              label: 'Bài viết cộng đồng',
              routerLink: 'user/post/forum'
            }
          ]
        },
        {
          label: 'Quản lý tài chính',
          icon: 'pi pi-chart-line',
          routerLink: 'user/balance-fluctuation',
          items: [
            {
              label: 'Nạp tiền',
              routerLink: 'user/recharge'
            },
            {
              label: 'Lịch sử giao dịch',
              routerLink: 'user/balance-fluctuation'
            }
          ]
        },
        {
          label: 'Thông báo BĐ giá',
          icon: 'pi pi-bell',
          routerLink: 'user/price-fluctuation-notify'
        },
        {
          label: 'Nhắn tin',
          icon: 'pi pi-comments',
          routerLink: 'user/message'
        },
        {
          label: 'Liên kết môi giới',
          icon: 'pi pi-users',
          routerLink: 'user/cooperate-agency'
        },
        {
          label: 'Quản lý tài khoản',
          icon: 'pi pi-user',
          routerLink: 'user/account-management'
        }
      ]
    }
    if (this.roles.includes(ROLE.ROLE_ADMIN)) {
      this.sidebarItems = [
        {
          label: 'Thống kê',
          icon: 'pi pi-th-large',
          routerLink: 'admin/dashboard'
        },
        {
          label: 'Quản lý bài viết',
          icon: 'pi pi-list',
          routerLink: 'admin/post',
          items: [
            {
              label: 'Bài viết bán/cho thuê',
              routerLink: 'admin/post/main'
            },
            {
              label: 'Bài viết cộng đồng',
              routerLink: 'admin/post/forum'
            },
            {
              label: 'Bài viết tin tức',
              routerLink: 'admin/post/info'
            }
          ]
        },
        {
          label: 'Quản lý tài khoản người dùng',
          icon: 'pi pi-user',
          routerLink: 'admin/manage-account'
        },
        {
          label: 'Quản lý báo cáo bài viết',
          icon: 'pi pi-exclamation-triangle',
          routerLink: 'admin/report'
        },
        {
          label: 'Quản lý giao dịch tài chính',
          icon: 'pi pi-chart-line',
          routerLink: 'admin/finance-transaction'
        },
        {
          label: 'Nhắn tin với người dùng',
          icon: 'pi pi-comments',
          routerLink: 'admin/message'
        },
        {
          label: 'Quản lý thông tin hệ thống',
          icon: 'pi pi-info-circle',
          routerLink: 'admin/about'
        }
      ]
    }
    this.emailVerify = '';
    
    this.displayChangePassword = false;
    this.newPassword = '';
    this.newPasswordAgain = '';
    this.verifyOTP = '';
    this.responseOTP = '';
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this._loadingService.loading(true);
    this._userService.getUserById()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        // console.log(response);
        if (response.status === HttpStatusCode.Ok) {
          this.user = response.data;
          this.emailVerify = this.user.email;
          if (response.data.avatarUrl != undefined && response.data.avatarUrl != null && response.data.avatarUrl.length > 0) {
            if (this.user.avatarUrl.includes(environment.BASE_URL_NO_AUTH)) {
              this._mediaService.retriveImage(this.user.avatarUrl)
                .pipe(takeUntil(this._unsubscribe))
                .subscribe((response: APIResponse) => {
                  if (response.status === HttpStatusCode.Ok) {
                    this.avatarUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${response.data.type};base64,${response.data.body}`);
                  } else {
                    this._messageService.errorMessage(response.message);
                  }
                })
            } else {
              this.avatarUrl = this.user.avatarUrl;
            }
          }
        } else {
          this._messageService.errorMessage(response.message);
        }
        this._loadingService.loading(false);
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
          this._messageService.errorMessage(response.message);
        }
      });
  }

  changePasswordFunc(): void {
    this.sendEmail();
  }

  sendEmail(): void {
    this._loadingService.loading(true);
    let emailVerify: EmailVerify = {
      email: this.emailVerify,
      title: "Mã OTP xác nhận đổi mật khẩu bkland",
      type: EMAIL_VERIFY_TYPE.FORGOT_PASSWORD
    }
    this._noAuthService.sendVerifyOTP(emailVerify)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          this.displayChangePassword = true;
          this.responseOTP = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
        this._loadingService.loading(false);
      });
  }

  changePassword(): void {
    this._loadingService.loading(true);
    let forgotPasswordChange: ForgotPasswordChange = {
      email: this.emailVerify,
      newPassword: this.newPassword
    };
    this._authService.forgotPasswordChange(forgotPasswordChange)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          this.displayChangePassword = false;
        } else {
          this._messageService.errorMessage(response.message);
        }
        this._loadingService.loading(false);
      })
  }

  validOTP(): boolean {
    if (this.verifyOTP === this.responseOTP) {
      return true;
    }
    return false;
  }

  validPassword(): boolean {
    if (this.newPassword.length > 0 
      && this.newPasswordAgain.length > 0 
      && this.newPassword != this.newPasswordAgain) {
      return true;
    }
    return false;
  }

  validChangePassword(): boolean {
    if (this.verifyOTP !== this.responseOTP) {
      return true;
    }
    if (this.newPassword.length == 0
      || this.newPasswordAgain.length == 0
      || (this.newPassword !== this.newPasswordAgain)) {
      return true;
    }
    return false;
  }
}
