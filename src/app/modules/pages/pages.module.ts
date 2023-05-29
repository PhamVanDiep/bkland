import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VnpaySuccessComponent } from './vnpay-success/vnpay-success.component';
import { RouterModule } from '@angular/router';
import { route } from './pages.routing';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  declarations: [
    VnpaySuccessComponent,
    ForbiddenComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    RouterModule.forChild(route)
  ]
})
export class PagesModule { }
