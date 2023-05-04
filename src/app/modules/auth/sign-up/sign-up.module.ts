import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { RouterModule } from '@angular/router';
import { route } from './sign-up.routing';
import { AuthService } from 'src/app/core/services/auth.service';



@NgModule({
  declarations: [
    SignUpComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
  ],
  providers: [
    AuthService
  ]
})
export class SignUpModule { }
