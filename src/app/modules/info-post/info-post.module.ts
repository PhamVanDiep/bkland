import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { route } from './info-post.routing';
import { InfoPostComponent } from './info-post.component';
import { InfoPostDetailComponent } from './info-post-detail/info-post-detail.component';
import { AvatarModule } from 'primeng/avatar';



@NgModule({
  declarations: [
    InfoPostComponent,
    InfoPostDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    AvatarModule
  ]
})
export class InfoPostModule { }