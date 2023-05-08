import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AdministrationLayoutComponent } from './administration-layout/administration-layout.component';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from "primeng/avatar";
import { UserService } from '../core/services/user.service';
import { MenuModule } from 'primeng/menu';
import { LoadingService } from '../core/services/loading.service';
import { BadgeModule } from 'primeng/badge';
import { AboutService } from '../core/services/about.service';
import { AppPipeModule } from '../shared/app-pipe/app-pipe.module';

@NgModule({
  declarations: [
    MainLayoutComponent,
    AdministrationLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    AvatarModule,
    MenuModule,
    BadgeModule,
    AppPipeModule
  ],
  exports: [
    MainLayoutComponent,
    AdministrationLayoutComponent
  ],
  providers: [
    UserService,
    LoadingService,
    AboutService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class LayoutModule { }
