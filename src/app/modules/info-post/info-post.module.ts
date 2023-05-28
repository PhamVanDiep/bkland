import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { route } from './info-post.routing';
import { InfoPostComponent } from './info-post.component';



@NgModule({
  declarations: [
    InfoPostComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class InfoPostModule { }
