import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AdministrationLayoutComponent } from './administration-layout/administration-layout.component';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from "primeng/avatar";
import { UserService } from '../core/services/user.service';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AboutService } from '../core/services/about.service';
import { AppPipeModule } from '../shared/app-pipe/app-pipe.module';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { NoAuthService } from '../core/services/no-auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChargeService } from '../core/services/charge.service';
import { InputTextModule } from 'primeng/inputtext';
import { ChatDialogComponent } from './main-layout/chat-dialog/chat-dialog.component';
import { RealEstatePostService } from '../core/services/real-estate-post.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    MainLayoutComponent,
    AdministrationLayoutComponent,
    ChatDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    AvatarModule,
    MenuModule,
    BadgeModule,
    AppPipeModule,
    SidebarModule,
    ButtonModule,
    RippleModule,
    DialogModule,
    PasswordModule,
    FormsModule,
    ProgressSpinnerModule,
    ToastModule,
    FontAwesomeModule,
    InputTextModule,
    OverlayPanelModule,
    DropdownModule,
    InputNumberModule,
    MultiSelectModule,
    ConfirmDialogModule
  ],
  exports: [
    MainLayoutComponent,
    AdministrationLayoutComponent
  ],
  providers: [
    UserService,
    AboutService,
    NoAuthService,
    ChargeService,
    RealEstatePostService,
    ConfirmationService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LayoutModule { }
