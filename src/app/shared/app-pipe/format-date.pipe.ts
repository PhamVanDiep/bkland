import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  constructor(
    private _datePipe: DatePipe
  ) {}

  transform(value: Date | string, format: string = 'dd/MM/yyyy H:mm'): string {
    if (value == undefined || value == null || value?.toString().length == 0) {
      return '';
    }
    if (value.toString().at(value.toString().length - 1)?.toUpperCase() == "Z") {
      value = value.toString().substring(0, value.toString().length - 1);
    }
    return this._datePipe.transform(value, format) || '';
  }

}
