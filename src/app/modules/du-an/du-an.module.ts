import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuAnComponent } from './du-an.component';
import { RouterModule } from '@angular/router';
import { routes } from './du-an.routing';
import { AppCommonModule } from '../app-common/app-common.module';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    DuAnComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppCommonModule,
    PaginatorModule
  ]
})
export class DuAnModule { }
