import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { MenuItem } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { EMAIL_VERIFY_TYPE } from 'src/app/core/constants/email-verify.constant';
import { HEADER_NAV } from 'src/app/core/constants/navigation.constant';
import { TYPE, TYPE_DROPDOWN } from 'src/app/core/constants/type.constant';
import { About } from 'src/app/core/models/about.model';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { EmailVerify } from 'src/app/core/models/email-verify.model';
import { ForgotPasswordChange } from 'src/app/core/models/forgot-password-change.model';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import { UserDeviceToken } from 'src/app/core/models/user-device-token.model';
import { AboutService } from 'src/app/core/services/about.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatService } from 'src/app/core/services/chat.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { UserService } from 'src/app/core/services/user.service';
import Util from 'src/app/core/utils/util';
import { environment } from 'src/environments/environment';

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
  avatarUrl: any;
  menuItems: MenuItem[];
  // loading: boolean = false;
  deviceInfo: DeviceInfo;
  noInterestedPost: string;
  about: About;

  emailVerify: string;

  displayChangePassword: boolean;
  newPassword: string;
  newPasswordAgain: string;
  verifyOTP: string;
  responseOTP: string;

  roles: string[];

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  chatRoomId: number;
  displayChatDialog: boolean;
  userDeviceId: string;

  lstInterestedPosts: any[];

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService,
    private _messageService: MessageService,
    private _loadingService: LoadingService,
    private _deviceDetectorService: DeviceDetectorService,
    private _aboutService: AboutService,
    private _noAuthService: NoAuthService,
    private _mediaService: MediaService,
    private _domSanitizer: DomSanitizer,
    private _chatService: ChatService,
    private _realEstatePostService: RealEstatePostService
  ) {
    let _roles = localStorage.getItem('roles') || '';
    this.roles = _roles.split(',');
    this.items = HEADER_NAV;
    this.isAuth = false;
    this.avatarIcon = "pi pi-user";
    this.avatarUrl = '/assets/images/user.png';
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
    this.innerWidth = window.innerWidth;
    this.emailVerify = '';
    
    this.displayChangePassword = false;
    this.newPassword = '';
    this.newPasswordAgain = '';
    this.verifyOTP = '';
    this.responseOTP = '';
    this.displayChatDialog = false;
    this.userDeviceId = '';
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
    this.lstInterestedPosts = [];
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this.isAuth = this._authService.isAuthenticated();

    if (this.isAuth) {
      this.getUserInfo();
    } else {
      let refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken != null && refreshToken.length > 0) {
        this._authService.loginByRefreshToken({
          refreshToken: refreshToken
        })
          .pipe(takeUntil(this._unsubscribe))
          .subscribe((response: APIResponse) => {
            if (response.status === HttpStatusCode.Ok) {
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              this.isAuth = true;
              setTimeout(() => {
                this.getUserInfo();
              }, 500);
            } else {
              this._messageService.errorMessage(response.message);
              this.getInterestedPostsOfUser('', this.deviceInfo.userAgent.replaceAll(' ', ''));
            }
          })
      } else {
        this.getInterestedPostsOfUser('', this.deviceInfo.userAgent.replaceAll(' ', ''));
      }
    }

    this._aboutService.getAboutInfo()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.about = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    this._realEstatePostService.interestPosts$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: number) => {
        this.noInterestedPost = response.toString();
      })
  }

  onActivate(event: any): void {
    Util.scrollToTop();
  }

  getUserInfo(): void {
    this._userService.getUserById()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        // console.log(response);
        if (response.status === HttpStatusCode.Ok) {
          this.user = response.data;
          this.getInterestedPostsOfUser(this.user.id, '');
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
      })
  }

  getInterestedPostsOfUser(userId: string, deviceInfo: string): void {
    this._realEstatePostService.countByUserIdAndDeviceInfo(userId, deviceInfo)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.noInterestedPost = response.data;
          this._realEstatePostService.setInterestPosts(+this.noInterestedPost);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  navigatePage(path: string): void {
    this._router.navigate([path]);
  }

  logout(): void {
    this._loadingService.loading(true);
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
        this._loadingService.loading(false);
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
      })
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

  chatWithAdmin(): void {
    if (this._authService.isAuthenticated()) {
      this._router.navigate(['user/chat']);
    } else {
      this.userDeviceId = this.deviceInfo.userAgent.replaceAll(' ', '');
      this._chatService.findAnonymousChatRoom(this.userDeviceId)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.chatRoomId = response.data.id;
            this.displayChatDialog = true;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  onHideChatDialog(event: any): void {
    this.displayChatDialog = false;
  }

  showInterested(): void {
    if (this._authService.isAuthenticated()) {
      this._router.navigate(['user/focus']);
    } else {
      this._realEstatePostService.findByUserIdAndDeviceInfo('', this.deviceInfo.userAgent.replaceAll(' ', ''))
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.lstInterestedPosts = response.data;
          } else {
            this._messageService.errorMessage(response.data);
          }
        })
    } 
  }

  genTypeName(type: string): string {
    let types = TYPE_DROPDOWN;
    let response = '';
    types.forEach(e => {
      if (e.key === type) {
        response = e.value;
      }
    });
    return response;
  }

  viewDetail(postId: string, isSell: boolean, type: string): void {
    if (isSell) {
      switch (type) {
        case TYPE.APARTMENT:
          this._router.navigate([`mua-ban/chung-cu/${postId}`])
          break;
        case TYPE.HOUSE:
          this._router.navigate([`mua-ban/nha-dat/${postId}`])
          break;
        case TYPE.PLOT:
          this._router.navigate([`mua-ban/dat-nen/${postId}`])
          break;
        default:
          break;
      }
    } else {
      switch (type) {
        case TYPE.APARTMENT:
          this._router.navigate([`cho-thue/chung-cu/${postId}`])
          break;
        case TYPE.HOUSE:
          this._router.navigate([`cho-thue/nha-dat/${postId}`])
          break;
        case TYPE.PLOT:
          this._router.navigate([`cho-thue/dat-nen/${postId}`])
          break;
        default:
          break;
      }
    }
  }

  showInterestedIcon(): boolean {
    if (this._userService.isAdmin() || this._userService.isEnterprise()) {
      return false;
    }
    return true;
  }
}
