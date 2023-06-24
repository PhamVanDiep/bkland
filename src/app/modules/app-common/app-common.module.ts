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
import { CommentComponent } from './comment/comment.component';
import { ChatComponent } from './chat/chat.component';
import { SocketioService } from 'src/app/core/services/socketio.service';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RealEstatePostViewComponent } from './real-estate-post-view/real-estate-post-view.component';
import { RepDetailComponent } from './real-estate-post-view/rep-detail/rep-detail.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { TimelineModule } from 'primeng/timeline';
import { AdministrativeViewComponent } from './real-estate-post-view/administrative-view/administrative-view.component';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { ClientViewComponent } from './real-estate-post-view/client-view/client-view.component';

@NgModule({
  declarations: [
    CreateForumPostComponent,
    ForumPostDetailComponent,
    ManageForumComponent,
    InfoComponent,
    CreateInfoPostComponent,
    ManageConfigComponent,
    CreateReportComponent,
    CommentComponent,
    ChatComponent,
    RealEstatePostViewComponent,
    RepDetailComponent,
    AdministrativeViewComponent,
    ClientViewComponent
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
    InputSwitchModule,
    SidebarModule,
    RadioButtonModule,
    GoogleMapsModule,
    TimelineModule,
    ClipboardModule
  ],
  exports: [
    CreateForumPostComponent,
    ForumPostDetailComponent,
    ManageForumComponent,
    InfoComponent,
    CreateInfoPostComponent,
    ManageConfigComponent,
    CreateReportComponent,
    CommentComponent,
    ChatComponent,
    RealEstatePostViewComponent,
    RepDetailComponent,
    AdministrativeViewComponent,
    ClientViewComponent
  ],
  providers: [
    ForumPostService,
    InfoPostService,
    PaymentService,
    ConfirmationService,
    PostReportService,
    SocketioService,
    ClipboardService
  ]
})
export class AppCommonModule { }
