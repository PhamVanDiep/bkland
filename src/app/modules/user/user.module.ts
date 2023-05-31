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
import { TagModule } from 'primeng/tag';
import { ManageMainPostComponent } from './manage-main-post/manage-main-post.component';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CooperateAgencyComponent } from './cooperate-agency/cooperate-agency.component';
import { RegisterComponent } from './cooperate-agency/register/register.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { SpecialAccountService } from 'src/app/core/services/special-account.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { InfoModule } from '../common/info/info.module';
import { ManageConfigComponent } from './manage-config/manage-config.component';
import { PriceFluctuationComponent } from './price-fluctuation/price-fluctuation.component';

@NgModule({
  declarations: [
    CreateMainPostComponent,
    AccountManagementComponent,
    ChargeComponent,
    BalanceFluctuationComponent,
    ManageMainPostComponent,
    CooperateAgencyComponent,
    RegisterComponent,
    ManageConfigComponent,
    PriceFluctuationComponent,
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
    HttpClientModule,
    TagModule,
    TableModule,
    MenuModule,
    ConfirmDialogModule,
    MultiSelectModule,
    InfoModule
  ],
  providers: [
    ConfirmationService,
    SpecialAccountService,
    PaymentService
  ]
})
export class UserModule { }
