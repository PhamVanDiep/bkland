import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {
  private title: string = 'Đăng nhập';
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  loading: boolean = false;
  login: Login;
  socialUser !: SocialUser;
  loginRemember: boolean = true;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _authService: AuthService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _socialAuthService: SocialAuthService
  ) {
    this._appTitleService.setTitle(this.title);
    if (this._authService.isAuthenticated()) {
      this._router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this.login = {
      username: '',
      password: ''
    }

    this._loadingService.loading$
      .subscribe((response: boolean) => {
        this.loading = response
      });

    this._socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      // console.log(this.socialUser);
      this._authService.checkEmailExist(this.socialUser.email)
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.login = {
              username: this.socialUser.email + "_user_bkland",
              password: this.socialUser.email + "_password_bkland"
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
          const redirectUrl = this._route.snapshot.queryParamMap.get('redirectUrl') || '/signed-in-redirect';
          this._router.navigateByUrl(redirectUrl);
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
    let registerRequest: SignUpRequest = {
      id: uuid.v4(),
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
      ]
    }
    this._authService.register(registerRequest)
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.login = {
            username: this.socialUser.email + "_user_bkland",
            password: this.socialUser.email + "_password_bkland"
          }
          this.loginRequest();
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }
}
