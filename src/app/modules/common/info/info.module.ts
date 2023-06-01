import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info.component';
import { CreateInfoPostComponent } from './create-info-post/create-info-post.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { PaymentService } from 'src/app/core/services/payment.service';
import { DropdownModule } from 'primeng/dropdown';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { EditorModule } from 'primeng/editor';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';


@NgModule({
  declarations: [
    InfoComponent,
    CreateInfoPostComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
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
    MultiSelectModule
  ],
  exports: [
    InfoComponent,
    CreateInfoPostComponent
  ],
  providers: [
    InfoPostService,
    PaymentService,
    ConfirmationService
  ]
})
export class InfoModule { }
