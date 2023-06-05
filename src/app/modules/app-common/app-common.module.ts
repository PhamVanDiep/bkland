import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { ForumPostService } from 'src/app/core/services/forum-post.service';
import { ManageForumComponent } from './create-forum-post/manage-forum/manage-forum.component';
import { ForumPostDetailComponent } from './create-forum-post/forum-post-detail/forum-post-detail.component';
import { CreateForumPostComponent } from './create-forum-post/create-forum-post.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService } from 'primeng/api';
import { PaymentService } from 'src/app/core/services/payment.service';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { CreateInfoPostComponent } from './info/create-info-post/create-info-post.component';
import { InfoComponent } from './info/info.component';
import { ManageConfigComponent } from './manage-config/manage-config.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CreateReportComponent } from './create-report/create-report.component';
import { PostReportService } from 'src/app/core/services/post-report.service';

@NgModule({
  declarations: [
    CreateForumPostComponent,
    ForumPostDetailComponent,
    ManageForumComponent,
    InfoComponent,
    CreateInfoPostComponent,
    ManageConfigComponent,
    CreateReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextareaModule,
    RippleModule,
    TooltipModule,
    ConfirmDialogModule,
    GalleriaModule,
    ImageModule,
    AvatarModule,
    OverlayPanelModule,
    MenuModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    TagModule,
    CardModule,
    DropdownModule,
    EditorModule,
    MultiSelectModule,
    InputSwitchModule
  ],
  exports: [
    CreateForumPostComponent,
    ForumPostDetailComponent,
    ManageForumComponent,
    InfoComponent,
    CreateInfoPostComponent,
    ManageConfigComponent,
    CreateReportComponent
  ],
  providers: [
    ForumPostService,
    InfoPostService,
    PaymentService,
    ConfirmationService,
    PostReportService
  ]
})
export class AppCommonModule { }
