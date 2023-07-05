import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { ChartOptions } from '../../admin/admin.component';
import { MONTHS } from 'src/app/core/constants/time-select.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-rep-statistic',
  templateUrl: './rep-statistic.component.html',
  styleUrls: ['./rep-statistic.component.css']
})
export class RepStatisticComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  @Input() postId: string;

  viewChartLoading: boolean;
  commentChartLoading: boolean;
  interestedChartLoading: boolean;
  reportChartLoading: boolean;
  clickedViewChartLoading: boolean;

  viewChartOptions: ChartOptions;
  commentChartOptions: ChartOptions;
  interestedChartOptions: ChartOptions;
  reportChartOptions: ChartOptions;
  clickedViewChartOptions: ChartOptions;

  month: number;
  year: number;
  months: any[];
  years: any[];

  constructor(
    private _messageService: MessageService,
    private _realEstatePostService: RealEstatePostService
  ) {
    this.viewChartLoading = false;
    this.commentChartLoading = false;
    this.interestedChartLoading = false;
    this.reportChartLoading = false;
    this.clickedViewChartLoading = false;

    this.viewChartOptions =  {
      chart: {
        type: 'bar',
        width: '100%'
      },
      dataLabels: {
      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    };
    this.commentChartOptions =  {
      chart: {
        type: 'bar',
        width: '100%'
      },
      dataLabels: {
      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    };
    this.interestedChartOptions =  {
      chart: {
        type: 'bar',
        width: '100%'
      },
      dataLabels: {
      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    };
    this.reportChartOptions =  {
      chart: {
        type: 'bar',
        width: '100%'
      },
      dataLabels: {
      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    };
    this.clickedViewChartOptions = {
      chart: {
        type: 'bar',
        width: '100%'
      },
      dataLabels: {
      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }

    this.month = (new Date()).getMonth() + 1;
    this.year = new Date().getFullYear();
    this.months = MONTHS;
    this.years = [];
    let minYear = 2023;
    let currYear = new Date().getFullYear();
    for (let index = minYear; index <= currYear; index++) {
      this.years.push({
        key: index,
        value: index
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    this.fetchData();
  }

  ngOnInit(): void {
  }

  fetchData(): void {
    if (this.postId != undefined && this.postId != null && this.postId.length > 0) {
      this.getViewChartData();
      this.getCommentChartData();
      this.getInterestedChartData();
      this.getReportChartData(); 
      this.getClickedViewChartData();
    }
  }

  getViewChartData(): void {
    this.viewChartLoading = true;
    this._realEstatePostService.getViewChartOption(this.postId, (this.month != null && this.month > 0) ? this.month : 0, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setViewChartOptions(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getCommentChartData(): void {
    this.commentChartLoading = true;
    this._realEstatePostService.getCommentChartOption(this.postId, (this.month != null && this.month > 0) ? this.month : 0, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setCommentChartOptions(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getInterestedChartData(): void {
    this.interestedChartLoading = true;
    this._realEstatePostService.getInterestedChartOption(this.postId, (this.month != null && this.month > 0) ? this.month : 0, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setInterestedChartOptions(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getClickedViewChartData(): void {
    this.clickedViewChartLoading = true;
    this._realEstatePostService.getClickedViewChartOption(this.postId, (this.month != null && this.month > 0) ? this.month : 0, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setClickedViewChartOptions(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getReportChartData(): void {
    this.reportChartLoading = true;
    this._realEstatePostService.getReportChartOption(this.postId, (this.month != null && this.month > 0) ? this.month : 0, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setReportChartOptions(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  setViewChartOptions(data: any): void {
    this.viewChartOptions.xaxis = {
      categories: data.xaxis,
      title: {
        text: this.month != 0 ? 'Ngày' : 'Tháng'
      }
    }
    this.viewChartOptions.series = [
      {
        name: 'Số lượt xem',
        data: data.series
      }
    ];
    this.viewChartLoading = false;
  }

  setCommentChartOptions(data: any): void {
    this.commentChartOptions.xaxis = {
      categories: data.xaxis,
      title: {
        text: this.month != 0 ? 'Ngày' : 'Tháng'
      }
    }
    this.commentChartOptions.series = [
      {
        name: 'Số lượt bình luận',
        data: data.series
      }
    ];
    this.commentChartLoading = false;
  }

  setInterestedChartOptions(data: any): void {
    this.interestedChartOptions.xaxis = {
      categories: data.xaxis,
      title: {
        text: this.month != 0 ? 'Ngày' : 'Tháng'
      }
    }
    this.interestedChartOptions.series = [
      {
        name: 'Số lượt quan tâm',
        data: data.series
      }
    ];
    this.interestedChartLoading = false;
  }

  setReportChartOptions(data: any): void {
    this.reportChartOptions.xaxis = {
      categories: data.xaxis,
      title: {
        text: this.month != 0 ? 'Ngày' : 'Tháng'
      }
    }
    this.reportChartOptions.series = [
      {
        name: 'Số lượt báo cáo',
        data: data.series
      }
    ];
    this.reportChartLoading = false;
  }

  setClickedViewChartOptions(data: any): void {
    this.clickedViewChartOptions.xaxis = {
      categories: data.xaxis,
      title: {
        text: this.month != 0 ? 'Ngày' : 'Tháng'
      }
    }
    this.clickedViewChartOptions.series = [
      {
        name: 'Số lượt xem thông tin liên hệ',
        data: data.series
      }
    ];
    this.clickedViewChartLoading = false;
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
