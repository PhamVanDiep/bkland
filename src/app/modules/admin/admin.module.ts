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

@NgModule({
  declarations: [
    AdminComponent,
    AboutComponent,
    FinanceTransactionComponent,
    MainPostComponent,
    UserAccountComponent
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
    MenuModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class AdminModule { }
