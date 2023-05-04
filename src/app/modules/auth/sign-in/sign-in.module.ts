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
    PasswordModule
  ],
  providers: [
    AppTitleService,
    AuthService
  ]
})
export class SignInModule { }
