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
import { PriceFluctuationComponent } from './price-fluctuation/price-fluctuation.component';
import { AppCommonModule } from '../app-common/app-common.module';
import { NewRequestComponent } from './cooperate-agency/new-request/new-request.component';
import { FocusComponent } from './focus/focus.component';
import { PaginatorModule } from 'primeng/paginator';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { EditorModule } from 'primeng/editor';
import { ProjectService } from 'src/app/core/services/project.service';
import { InterestedUserComponent } from './interested-user/interested-user.component';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { AppPipeModule } from 'src/app/shared/app-pipe/app-pipe.module';

@NgModule({
  declarations: [
    CreateMainPostComponent,
    AccountManagementComponent,
    ChargeComponent,
    BalanceFluctuationComponent,
    ManageMainPostComponent,
    CooperateAgencyComponent,
    RegisterComponent,
    PriceFluctuationComponent,
    NewRequestComponent,
    FocusComponent,
    DashboardComponent,
    ProjectComponent,
    ProjectDetailComponent,
    InterestedUserComponent,
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
    AppCommonModule,
    PaginatorModule,
    EditorModule,
    ClipboardModule,
    AppPipeModule
  ],
  providers: [
    ConfirmationService,
    SpecialAccountService,
    PaymentService,
    ProjectService,
    ClipboardService
  ]
})
export class UserModule { }
