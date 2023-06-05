import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { route } from './admin.routing';
import { AboutComponent } from './about/about.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FinanceTransactionComponent } from './finance-transaction/finance-transaction.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MainPostComponent } from './main-post/main-post.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { PaymentService } from 'src/app/core/services/payment.service';
import { DropdownModule } from 'primeng/dropdown';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { EditorModule } from 'primeng/editor';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { ReportComponent } from './report/report.component';
import { ReportTypeService } from 'src/app/core/services/report-type.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AppCommonModule } from '../app-common/app-common.module';

@NgModule({
  declarations: [
    AdminComponent,
    AboutComponent,
    FinanceTransactionComponent,
    MainPostComponent,
    UserAccountComponent,
    ReportComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    ButtonModule,
    RippleModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    TagModule,
    ImageModule,
    ConfirmDialogModule,
    MenuModule,
    CardModule,
    DropdownModule,
    EditorModule,
    TooltipModule,
    TabViewModule,
    RadioButtonModule,
    CheckboxModule,
    AppCommonModule
  ],
  providers: [
    ConfirmationService,
    PaymentService,
    InfoPostService,
    ReportTypeService
  ]
})
export class AdminModule { }
