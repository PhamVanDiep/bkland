import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumComponent } from './forum.component';
import { RouterModule } from '@angular/router';
import { route } from './forum.routing';
import { CreateForumPostModule } from '../common/create-forum-post/create-forum-post.module';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    ForumComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CreateForumPostModule,
    AvatarModule,
    InputTextModule,
    ButtonModule
  ]
})
export class ForumModule { }
