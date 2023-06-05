import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumComponent } from './forum.component';
import { RouterModule } from '@angular/router';
import { route } from './forum.routing';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AppCommonModule } from '../app-common/app-common.module';



@NgModule({
  declarations: [
    ForumComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    AppCommonModule,
    AvatarModule,
    InputTextModule,
    ButtonModule
  ]
})
export class ForumModule { }
