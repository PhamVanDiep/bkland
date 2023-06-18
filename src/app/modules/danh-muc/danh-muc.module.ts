import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DanhMucComponent } from './danh-muc.component';
import { RouterModule } from '@angular/router';
import { routes } from './danh-muc.routing';
import { AppCommonModule } from '../app-common/app-common.module';



@NgModule({
  declarations: [
    DanhMucComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppCommonModule
  ]
})
export class DanhMucModule { }
