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
import { ReportDetailComponent } from './report/report-detail/report-detail.component';
import { ForumPostDetailComponent } from './forum-post-detail/forum-post-detail.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardPriceComponent } from './dashboard/dashboard-price/dashboard-price.component';
import { DashboardPostComponent } from './dashboard/dashboard-post/dashboard-post.component';
import { TimelineModule } from 'primeng/timeline';
import { ProjectComponent } from './project/project.component';
import { DashboradProjectComponent } from './dashboard/dashborad-project/dashborad-project.component';
import { AppPipeModule } from 'src/app/shared/app-pipe/app-pipe.module';

@NgModule({
  declarations: [
    AdminComponent,
    AboutComponent,
    FinanceTransactionComponent,
    MainPostComponent,
    UserAccountComponent,
    ReportComponent,
    ReportDetailComponent,
    ForumPostDetailComponent,
    DashboardPriceComponent,
    DashboardPostComponent,
    ProjectComponent,
    DashboradProjectComponent,
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
    AppCommonModule,
    NgApexchartsModule,
    TimelineModule,
    AppPipeModule
  ],
  providers: [
    ConfirmationService,
    PaymentService,
    InfoPostService,
    ReportTypeService
  ]
})
export class AdminModule { }
