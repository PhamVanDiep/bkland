import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { RouterModule } from '@angular/router';
import { route } from './landing-page.routing';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChatDialogComponent } from '../../layout/main-layout/chat-dialog/chat-dialog.component';
import { AppCommonModule } from '../app-common/app-common.module';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AppPipeModule } from 'src/app/shared/app-pipe/app-pipe.module';


@NgModule({
  declarations: [
    LandingPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    DropdownModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    RippleModule,
    TooltipModule,
    OverlayPanelModule,
    InputNumberModule,
    AppCommonModule,
    FormsModule,
    DialogModule,
    AppPipeModule
  ]
})
export class LandingPageModule { }
