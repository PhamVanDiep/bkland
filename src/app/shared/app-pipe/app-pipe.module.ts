import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PhonePipe } from './phone.pipe';
import { FormatDatePipe } from './format-date.pipe';

@NgModule({
  declarations: [
    PhonePipe,
    FormatDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PhonePipe,
    FormatDatePipe
  ],
  providers: [
    DatePipe
  ]
})
export class AppPipeModule { }
