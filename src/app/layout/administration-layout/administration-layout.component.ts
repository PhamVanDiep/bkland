import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { MenuItem } from 'primeng/api';
import { ReplaySubject, filter, firstValueFrom, takeUntil } from 'rxjs';
import { EMAIL_VERIFY_TYPE } from 'src/app/core/constants/email-verify.constant';
import { ADMIN_NAV, ENTERPRISE_NAV, HEADER_NAV, USER_NAV } from 'src/app/core/constants/navigation.constant';
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
      this.items = HEADER_NAV;
    } else {
      this.items = [];
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

    if (this.roles.includes(ROLE.ROLE_USER)) {
      this.sidebarItems = USER_NAV;
    }
    if (this.roles.includes(ROLE.ROLE_ADMIN)) {
      this.sidebarItems = ADMIN_NAV;
    }
    if (this.roles.includes(ROLE.ROLE_ENTERPRISE)) {
      this.sidebarItems = ENTERPRISE_NAV;
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
          this.retriveAvatar(this.user.avatarUrl);
        } else {
          this._messageService.errorMessage(response.message);
        }
        this._loadingService.loading(false);
      });

    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();

    this._router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        if (this.innerWidth < 640) {
          this.sidebarVisible = false; 
        }
      });

    this._userService.avatarUpdate$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((path: string) => {
        this.retriveAvatar(path);
      })
  }

  async retriveAvatar(path: string) {
    if (path == undefined || path == null || path.length == 0) {
      this.avatarUrl = '/assets/images/user.png'
    } else if (path.includes(environment.BASE_URL_NO_AUTH)) {
      await firstValueFrom(this._mediaService.retriveImage(path).pipe(takeUntil(this._unsubscribe))) 
        .then((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.avatarUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${response.data.type};base64,${response.data.body}`);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this.avatarUrl = this.user.avatarUrl;
    }
    this._mediaService.setAvatar(this.avatarUrl);
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
