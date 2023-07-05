import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MONTHS } from 'src/app/core/constants/time-select.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { UserService } from 'src/app/core/services/user.service';
import { ChartOptions } from '../../admin.component';

@Component({
  selector: 'app-dashboard-price',
  templateUrl: './dashboard-price.component.html',
  styleUrls: ['./dashboard-price.component.css']
})
export class DashboardPriceComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Thống kê';

  userStatistic: any;
  userChartOptions: ChartOptions;

  thanhToanThang: number;
  thanhToanNam: number;

  thanhToanThangChartOptions: ChartOptions;
  thanhToanNamChartOptions: ChartOptions;
  months: any[];
  years: any[];

  napNamChartOptions: ChartOptions;
  napThangChartOptions: ChartOptions;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _userService: UserService,
    private _paymentService: PaymentService,
    private _appTitleService: AppTitleService
  ) {
    this._appTitleService.setTitle(this.title);
    this.userChartOptions = {
      chart: {
        type: 'donut',
        width: '100%'
      },
      dataLabels: {

      },
      labels: ['Người dùng thường', 'Môi giới', 'Doanh nghiệp'],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }
    this.thanhToanNamChartOptions = {
      chart: {
        type: 'bar',
        width: '100%',
        stacked: true
      },
      dataLabels: {

      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }
    this.thanhToanThangChartOptions = {
      chart: {
        type: 'bar',
        width: '100%',
        stacked: true
      },
      dataLabels: {

      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }
    this.napNamChartOptions = {
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
    this.napThangChartOptions = {
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
    this.userStatistic = {
      noOfActiveUsers: 0,
      noOfDisableUsers: 0,
      noOfMonthNewestUsers: 0,
      noOfPreviousMonthNewestUsers: 0,
      noOfMonthDisableUsers: 0,
      noOfPreviousMonthDisableUsers: 0,
      diffNewestMonth: '0%',
      diffDisableMonth: '0%'
    }

    this.thanhToanThang = (new Date()).getMonth() + 1;
    this.thanhToanNam = (new Date()).getFullYear();
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

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._userService.getAllUsers()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setUserChartData(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
    this.getThanhToanNamData();
    this.getThanhToanThangData();
    this.getNapTienNamData();
    this.getNapTienThangData();
  }

  getThanhToanNamData(): void {
    this._loadingService.loading(true);
    this._paymentService.thanhToanNam(this.thanhToanNam)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.setThanhToanNamChartData(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  getThanhToanThangData(): void {
    this._paymentService.thanhToanThang(this.thanhToanThang, this.thanhToanNam)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.setThanhToanThangChartData(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  getNapTienNamData(): void {
    this._loadingService.loading(true);
    this._paymentService.napTienNam(this.thanhToanNam)
    .pipe(takeUntil(this._unsubscribe))
    .subscribe((response: APIResponse) => {
      this._loadingService.loading(false);
      if (response.status === HttpStatusCode.Ok) {
        this.setNapTienNamChartData(response.data);
      } else {
        this._messageService.errorMessage(response.message);
      }
    });
  }

  getNapTienThangData(): void {
    this._loadingService.loading(true);
    this._paymentService.napTienThang(this.thanhToanThang, this.thanhToanNam)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.setNapTienThangChartData(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  setUserChartData(data: any[]): void {
    let _data = data.filter(e => e.id != "admin");
    this.userStatistic.noOfActiveUsers = _data.filter(e => e.enable).length;
    this.userStatistic.noOfDisableUsers = _data.length - this.userStatistic.noOfActiveUsers;
    this.userStatistic.noOfMonthNewestUsers = _data.filter(e => (new Date()).getMonth() == (new Date(e.createAt)).getMonth()).length;
    this.userStatistic.noOfPreviousMonthNewestUsers = _data.filter(e => (new Date()).getMonth() - 1 == (new Date(e.createAt)).getMonth()).length;
    this.userStatistic.noOfMonthDisableUsers = _data.filter(e => e.updateAt != null && (new Date()).getMonth() == (new Date(e.updateAt)).getMonth() && !e.enable).length;
    this.userStatistic.noOfPreviousMonthDisableUsers = _data.filter(e => e.updateAt != null && (new Date()).getMonth() - 1 == (new Date(e.updateAt)).getMonth() && !e.enable).length;
    let noOfAgencies = 0;
    let noOfEnterprises = 0;
    let noOfUsers = 0;
    _data.forEach(e => {
      e.roles.forEach((ee: any) => {
        if (ee.id == 2) {
          noOfAgencies++;
        } else if (ee.id == 3) {
          noOfEnterprises ++;
        }
      });
    });
    noOfUsers = _data.length - noOfAgencies - noOfEnterprises;
    this.userChartOptions.series = [noOfUsers, noOfAgencies, noOfEnterprises];
    if (this.userStatistic.noOfPreviousMonthNewestUsers != 0) {
      this.userStatistic.diffNewestMonth = ((Math.abs(this.userStatistic.noOfPreviousMonthNewestUsers - this.userStatistic.noOfMonthNewestUsers) / this.userStatistic.noOfPreviousMonthNewestUsers)*100).toFixed(2) + '%';
    } else {
      if (this.userStatistic.noOfMonthNewestUsers > 0) {
        this.userStatistic.diffNewestMonth = this.userStatistic.noOfMonthNewestUsers; 
      }
    }
    if (this.userStatistic.noOfPreviousMonthDisableUsers != 0) {
      this.userStatistic.diffDisableMonth = ((Math.abs(this.userStatistic.noOfPreviousMonthDisableUsers - this.userStatistic.noOfMonthDisableUsers) / this.userStatistic.noOfPreviousMonthDisableUsers)*100).toFixed(2) + '%';
    } else {
      if (this.userStatistic.noOfMonthDisableUsers > 0) {
        this.userStatistic.diffDisableMonth = this.userStatistic.noOfMonthDisableUsers; 
      }
    }
  }

  getNewestUsersSeverity(): string {
    if (this.userStatistic.noOfMonthNewestUsers < this.userStatistic.noOfPreviousMonthNewestUsers) {
      return 'danger';
    } else if (this.userStatistic.noOfMonthNewestUsers == this.userStatistic.noOfPreviousMonthNewestUsers) {
      return 'warning'
    } else {
      return 'success';
    }
  }

  getDisableUserSeverity(): string {
    if (this.userStatistic.noOfMonthDisableUsers > this.userStatistic.noOfPreviousMonthDisableUsers) {
      return 'danger';
    } else {
      return 'success';
    }
  }

  setThanhToanNamChartData(data: any): void {
    this.thanhToanNamChartOptions.series = [
      {
        name: 'Phí đăng bài',
        data: data.postPrice
      },
      {
        name: 'Thanh toán định kỳ',
        data: data.specialAccountPay
      }
    ];
    this.thanhToanNamChartOptions.xaxis = {
      categories: data.month,
      title: {
        text: 'Tháng'
      }
    }
  }

  setThanhToanThangChartData(data: any): void {
    this.thanhToanThangChartOptions.series = [
      {
        name: 'Phí đăng bài',
        data: data.postPrice
      },
      {
        name: 'Thanh toán định kỳ',
        data: data.specialAccountPay
      }
    ];
    this.thanhToanThangChartOptions.xaxis = {
      categories: data.ngay,
      title: {
        text: 'Ngày'
      }
    }
  }

  setNapTienNamChartData(data: any): void {
    this.napNamChartOptions.series = [
      {
        name: 'Số tiền',
        data: data.postPrice
      }
    ];
    this.napNamChartOptions.xaxis = {
      categories: data.month,
      title: {
        text: 'Tháng'
      }
    }
  }

  setNapTienThangChartData(data: any): void {
    this.napThangChartOptions.series = [
      {
        name: 'Số tiền',
        data: data.postPrice
      }
    ];
    this.napThangChartOptions.xaxis = {
      categories: data.ngay,
      title: {
        text: 'Ngày'
      }
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
