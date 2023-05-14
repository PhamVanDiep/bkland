import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { route } from './user.routing';
import { CreateMainPostComponent } from './create-main-post/create-main-post.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { AccountManagementComponent } from './account-management/account-management.component';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { ChargeComponent } from './charge/charge.component';
import { BalanceFluctuationComponent } from './balance-fluctuation/balance-fluctuation.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    CreateMainPostComponent,
    AccountManagementComponent,
    ChargeComponent,
    BalanceFluctuationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    RippleModule,
    AvatarModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    RadioButtonModule,
    CalendarModule,
    HttpClientModule
  ],
  providers: [
  ]
})
export class UserModule { }
