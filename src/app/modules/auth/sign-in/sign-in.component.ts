import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Login, LoginResponse } from 'src/app/core/models/sign-in.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { SocialUser, SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import * as uuid from 'uuid';
import { GENDER } from 'src/app/core/constants/gender.constant';
import { ROLE } from 'src/app/core/constants/role.constant';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { EmailVerify } from 'src/app/core/models/email-verify.model';
import { EMAIL_VERIFY_TYPE } from 'src/app/core/constants/email-verify.constant';
import { ForgotPasswordChange } from 'src/app/core/models/forgot-password-change.model';
import { UserDeviceTokenService } from 'src/app/core/services/user-device-token.service';
import { UserDeviceToken } from 'src/app/core/models/user-device-token.model';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {
  private title: string = 'Đăng nhập';
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  login: Login;
  socialUser !: SocialUser;
  loginRemember: boolean = true;
  innerWidth: any;

  displayEmailVerify: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }
  emailVerify: string;

  displayChangePassword: boolean;
  newPassword: string;
  newPasswordAgain: string;
  verifyOTP: string;
  responseOTP: string;

  deviceInfo: DeviceInfo;

  clicked: boolean = false;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _authService: AuthService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _socialAuthService: SocialAuthService,
    private _noAuthService: NoAuthService,
    private _userDeviceTokenService: UserDeviceTokenService,
    private _deviceDetectorService: DeviceDetectorService,
  ) {
    this._appTitleService.setTitle(this.title);
    if (this._authService.isAuthenticated()) {
      this._router.navigate(['/']);
    }
    this.innerWidth = window.innerWidth;
    this.emailVerify = '';
    
    this.displayChangePassword = false;
    this.newPassword = '';
    this.newPasswordAgain = '';
    this.verifyOTP = '';
    this.responseOTP = '';
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();

    this.login = {
      username: '',
      password: '',
      deviceInfo: this.deviceInfo.userAgent
    }

    this._socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      // console.log(this.socialUser);
      this._authService.checkEmailExist(this.socialUser.email)
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.login = {
              username: this.socialUser.email + "_user_bkland",
              password: this.socialUser.email + "_password_bkland",
              deviceInfo: this.deviceInfo.userAgent
            }
            this.loginRequest();
          } else if (response.status === HttpStatusCode.NoContent) {
            this.registerGoogleAccount();
          } else if (response.status === HttpStatusCode.BadRequest) {
            this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
          }
        })
    });
  }

  loginRequest(): void {
    this._loadingService.loading(true);
    this._authService.login(this.login)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          let loginResponse: LoginResponse = response.data;
          localStorage.setItem('accessToken', loginResponse.accessToken);
          if (this.loginRemember) {
            localStorage.setItem('refreshToken', loginResponse.refreshToken);
          } else {
            localStorage.removeItem('refreshToken');
          }
          localStorage.setItem('roles', loginResponse.roles.toString());
          // this._router.navigate(['/']);
          let userDeviceToken: UserDeviceToken = {
            id: 0,
            deviceInfo: this.deviceInfo.userAgent,
            enable: false,
            logout: false,
            notifyToken: '',
            userId: loginResponse.id,
            createBy: loginResponse.id,
            createAt: null,
            updateBy: '',
            updateAt: null
          }
          this._userDeviceTokenService.createUserDeviceToken(userDeviceToken)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response1: APIResponse) => {
              if (response1.status === HttpStatusCode.Ok) {
                const redirectUrl = this._route.snapshot.queryParamMap.get('redirectUrl') || '/signed-in-redirect';
                this._router.navigateByUrl(redirectUrl); 
              } else {
                this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response1.message });
              }
            });
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
        this._loadingService.loading(false);
      })
  }

  loginWithGoogle(): void {
    this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  registerGoogleAccount(): void {
    let _id = uuid.v4()
    let registerRequest: SignUpRequest = {
      id: _id,
      firstName: this.socialUser.firstName,
      middleName: "",
      lastName: this.socialUser.lastName,
      accountBalance: 0,
      address: "",
      dateOfBirth: "",
      districtCode: "NOT_FOUND",
      email: this.socialUser.email,
      enable: true,
      gender: GENDER.NOT_FOUND,
      username: this.socialUser.email + "_user_bkland",
      password: this.socialUser.email + "_password_bkland",
      identification: "",
      phoneNumber: "",
      provinceCode: "NOT_FOUND",
      wardCode: "NOT_FOUND",
      avatarUrl: this.socialUser.photoUrl,
      roles: [
        {
          id: 1,
          name: ROLE.ROLE_USER
        }
      ],
      createBy: _id,
      createAt: null,
      updateBy: '',
      updateAt: null
    }
    this._authService.register(registerRequest)
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.login = {
            username: this.socialUser.email + "_user_bkland",
            password: this.socialUser.email + "_password_bkland",
            deviceInfo: this.deviceInfo.userAgent
          }
          this.loginRequest();
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }

  forgotPassword(): void {
    this.displayEmailVerify = true;
  }

  sendEmail(): void {
    this.clicked = true;
    this._loadingService.loading(true);
    let emailVerify: EmailVerify = {
      email: this.emailVerify,
      title: "Mã OTP xác nhận quên mật khẩu bkland",
      type: EMAIL_VERIFY_TYPE.FORGOT_PASSWORD
    }
    this._noAuthService.sendVerifyOTP(emailVerify)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: response.message });
          this.displayEmailVerify = false;
          this.displayChangePassword = true;
          this.responseOTP = response.data;
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
          this.clicked = false;
        }
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
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: response.message });
          this.displayChangePassword = false;
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }

  validOTP(): boolean {
    if (this.verifyOTP.length <= 0) {
      return true;
    }
    if (this.verifyOTP === this.responseOTP && this.verifyOTP.length > 0) {
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

  register(): void {
    this._router.navigate(['register']);
  }
}
