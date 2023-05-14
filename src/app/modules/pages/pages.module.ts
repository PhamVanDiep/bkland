import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VnpaySuccessComponent } from './vnpay-success/vnpay-success.component';
import { RouterModule } from '@angular/router';
import { route } from './pages.routing';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ForbiddenComponent } from './forbidden/forbidden.component';



@NgModule({
  declarations: [
    VnpaySuccessComponent,
    ForbiddenComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    RouterModule.forChild(route)
  ]
})
export class PagesModule { }
