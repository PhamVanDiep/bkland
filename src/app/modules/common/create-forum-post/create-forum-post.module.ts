import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateForumPostComponent } from './create-forum-post.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ForumPostService } from 'src/app/core/services/forum-post.service';
import { TooltipModule } from 'primeng/tooltip';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { ForumPostDetailComponent } from './forum-post-detail/forum-post-detail.component';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { ManageForumComponent } from './manage-forum/manage-forum.component';

@NgModule({
  declarations: [
    CreateForumPostComponent,
    ForumPostDetailComponent,
    ManageForumComponent
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
    MenuModule
  ],
  exports: [
    CreateForumPostComponent,
    ForumPostDetailComponent,
    ManageForumComponent
  ],
  providers: [
    ForumPostService
  ]
})
export class CreateForumPostModule { }
