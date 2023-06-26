import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in.component';
import { RouterModule } from '@angular/router';
import { route } from './sign-in.routing';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { DialogModule } from 'primeng/dialog';
import { UserDeviceTokenService } from 'src/app/core/services/user-device-token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    ButtonModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    ProgressSpinnerModule,
    SocialLoginModule,
    DialogModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('276882401051-qmrklqqvuuht57jdcutjvs9bq5cuiihf.apps.googleusercontent.com'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    AppTitleService,
    AuthService,
    UserDeviceTokenService,
    JwtHelperService
  ]
})
export class SignInModule { }
