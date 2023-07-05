import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ChartOptions } from '../../admin.component';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { HttpStatusCode } from '@angular/common/http';
import { MONTHS } from 'src/app/core/constants/time-select.constant';
import { TYPE, TYPE_DROPDOWN } from 'src/app/core/constants/type.constant';
import { STATUS } from 'src/app/core/constants/status.constant';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { Province } from 'src/app/core/models/province.model';
import { District } from 'src/app/core/models/district.model';
import { ForumPostService } from 'src/app/core/services/forum-post.service';
import { InfoPostService } from 'src/app/core/services/info-post.service';

@Component({
  selector: 'app-dashboard-post',
  templateUrl: './dashboard-post.component.html',
  styleUrls: ['./dashboard-post.component.css']
})
export class DashboardPostComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private _title: string = 'Thống kê thông tin bài viết';

  lstDanhMuc: any[];
  sell: number;
  lstLoaiBDS: any[];
  type: string;

  months: any[];
  years: any[];
  allPostMonth: number;
  allPostYear: number;

  allPosts: any[];

  allPostChartOptions: ChartOptions;
  allPostStatusChartOptions: ChartOptions;

  allPostProvince: string;
  provinces: Province[];
  chart1Options: ChartOptions;
  chart2Options: ChartOptions;

  forumPostMonth: number;
  forumPostYear: number;
  forumPostChart1Options: ChartOptions;
  forumPostChart2Options: ChartOptions;

  infoPostChart1Options: ChartOptions;
  infoPostChart2Options: ChartOptions;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _realEstatePostService: RealEstatePostService,
    private _noAuthService: NoAuthService,
    private _forumPostService: ForumPostService,
    private _infoPostService: InfoPostService
  ) {
    this._appTitleService.setTitle(this._title);
    this.allPostMonth = (new Date()).getMonth() + 1;
    this.allPostYear = (new Date()).getFullYear();
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
    this.allPosts = [];
    this.allPostChartOptions = {
      chart: {
        type: 'donut',
        width: '100%'
      },
      dataLabels: {

      },
      labels: ['Bán nhà đất', 'Bán chung cư', 'Bán đất nền', 'Cho thuê nhà đất', 'Cho thuê chung cư'],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }
    this.allPostStatusChartOptions = {
      chart: {
        type: 'donut',
        width: '100%'
      },
      dataLabels: {

      },
      labels: ['Chờ kiểm duyệt', 'Đã kiểm duyệt', 'Bị từ chối', 'Đã hết hạn', 'Đã hoàn thành'],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }
    this.allPostProvince = '01';
    this.provinces = [];
    this.lstDanhMuc = [
      {
        key: 1,
        value: "Bán"
      },
      {
        key: 0,
        value: "Cho thuê"
      }
    ];
    this.lstLoaiBDS = TYPE_DROPDOWN;
    this.sell = 1;
    this.type = TYPE.HOUSE;
    this.chart1Options = {
      chart: {
        type: 'line',
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
    this.chart2Options = {
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
    this.forumPostChart1Options = {
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
    this.forumPostChart2Options = {
      chart: {
        type: 'line',
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
    this.forumPostMonth = (new Date()).getMonth() + 1;
    this.forumPostYear = (new Date()).getFullYear();

    this.infoPostChart1Options = {
      chart: {
        type: 'donut',
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

    this.infoPostChart2Options = {
      chart: {
        type: 'donut',
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
  }

  ngOnInit(): void {
    this.setLoadingTimeout();
    this._noAuthService.getAllProvinces()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.provinces = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
    this.getAllPost();
    this.getChart1Data();
    this.getChart2Data();
    this.getForumPostChart1Data();
    this.getForumPostChart2Data();
    this.getInfoPostChart1Data();
    this.getInfoPostChart2Data();
  }

  getAllPost(): void {
    this._realEstatePostService.getAllPost()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.allPosts = response.data;
          this.setAllPostChartData();
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getChart1Data(): void {
    this._realEstatePostService.getChart1Data(this.sell, this.type, this.allPostProvince, this.allPostYear)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setChart1Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getChart2Data(): void {
    this._realEstatePostService.getChart2Data(this.sell, this.type, this.allPostProvince, this.allPostYear)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setChart2Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  setAllPostChartData(): void {
    let noOfBND = this.allPosts.filter(e => e.sell == 1 && e.type == TYPE.HOUSE && this.checkMonthYear(e.createAt)).length;
    let noOfBCC = this.allPosts.filter(e => e.sell == 1 && e.type == TYPE.APARTMENT && this.checkMonthYear(e.createAt)).length;
    let noOfBDN = this.allPosts.filter(e => e.sell == 1 && e.type == TYPE.PLOT && this.checkMonthYear(e.createAt)).length;
    let noOfCTND = this.allPosts.filter(e => e.sell == 0 && e.type == TYPE.HOUSE && this.checkMonthYear(e.createAt)).length;
    let noOfCTCC = this.allPosts.filter(e => e.sell == 0 && e.type == TYPE.APARTMENT && this.checkMonthYear(e.createAt)).length;
    this.allPostChartOptions.series = [noOfBND, noOfBCC, noOfBDN, noOfCTND, noOfCTCC];

    let noOfCKD = this.allPosts.filter(e => e.status == STATUS.CHO_KIEM_DUYET && this.checkMonthYear(e.createAt)).length;
    let noOfDHH = this.allPosts.filter(e => e.status == STATUS.DA_HET_HAN && this.checkMonthYear(e.createAt)).length;
    let noOfBTC = this.allPosts.filter(e => e.status == STATUS.BI_TU_CHOI && this.checkMonthYear(e.createAt)).length;
    let noOfDKD = this.allPosts.filter(e => e.status == STATUS.DA_KIEM_DUYET && this.checkMonthYear(e.createAt)).length;
    let noOfDHT = this.allPosts.filter(e => e.status == STATUS.DA_HOAN_THANH && this.checkMonthYear(e.createAt)).length;
    this.allPostStatusChartOptions.series = [noOfCKD, noOfDKD, noOfBTC, noOfDHH, noOfDHT];
  }

  setChart1Data(data: any): void {
    this.chart1Options.xaxis = {
      categories: data.xaxis,
      title: {
        text: 'Tháng'
      }
    };
    this.chart1Options.series = data.series;
  }

  setChart2Data(data: any): void {
    this.chart2Options.xaxis = {
      categories: data.xaxis,
      title: {
        text: 'Tháng'
      }
    };
    this.chart2Options.series = data.series;
  }

  checkMonthYear(createAt: string): boolean {
    let createAtDate = new Date(createAt);
    if (this.allPostMonth == createAtDate.getMonth() + 1 && this.allPostYear == createAtDate.getFullYear()) {
      return true;
    }
    return false;
  }

  setLoadingTimeout(): void {
    this._loadingService.loading(true);
    setTimeout(() => {
      this._loadingService.loading(false);
    }, 3000);
  }

  getChart1Title(): string {
    let result = '';
    if (this.sell == 1) {
      if (this.type == TYPE.APARTMENT) {
        result += 'Bán chung cư ';
      } else if (this.type == TYPE.HOUSE) {
        result += 'Bán nhà đất ';
      } else {
        result += 'Bán đất nền ';
      }
    } else {
      if (this.type == TYPE.APARTMENT) {
        result += 'Cho thuê chung cư ';
      } else if (this.type == TYPE.HOUSE) {
        result += 'Cho thuê nhà đất ';
      }
    }
    this.provinces.forEach(e => {
      if (e.code == this.allPostProvince) {
        result += e.fullName;
      }
    })
    result += ` năm ${this.allPostYear}`
    return result;
  }

  getChart2Title(): string {
    let result = 'Số lượt xem, quan tâm, bình luận, báo cáo ';
    if (this.sell == 1) {
      if (this.type == TYPE.APARTMENT) {
        result += 'Bán chung cư ';
      } else if (this.type == TYPE.HOUSE) {
        result += 'Bán nhà đất ';
      } else {
        result += 'Bán đất nền ';
      }
    } else {
      if (this.type == TYPE.APARTMENT) {
        result += 'Cho thuê chung cư ';
      } else if (this.type == TYPE.HOUSE) {
        result += 'Cho thuê nhà đất ';
      }
    }
    this.provinces.forEach(e => {
      if (e.code == this.allPostProvince) {
        result += e.fullName;
      }
    })
    result += ` năm ${this.allPostYear}`
    return result;
  }

  getForumPostChart1Data(): void {
    this._forumPostService.getChart1Data(this.forumPostMonth == null ? 0 : this.forumPostMonth, this.forumPostYear)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setForumPostChart1Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  getForumPostChart2Data(): void {
    this._forumPostService.getChart2Data(this.forumPostMonth == null ? 0 : this.forumPostMonth, this.forumPostYear)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setForumPostChart2Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  setForumPostChart1Data(data: any): void {
    this.forumPostChart1Options.xaxis = {
      categories: data.xaxis,
      title: {
        text: this.forumPostMonth != 0 ? 'Ngày' : 'Tháng'
      }
    }
    this.forumPostChart1Options.series = [
      {
        name: 'Số bài viết',
        data: data.series
      }
    ]
  }

  setForumPostChart2Data(data: any): void {
    this.forumPostChart2Options.xaxis = {
      categories: data.xaxis,
      title: {
        text: this.forumPostMonth != 0 ? 'Ngày' : 'Tháng'
      }
    }
    this.forumPostChart2Options.series = data.series;
  }

  getInfoPostChart1Data(): void {
    this._infoPostService.getChart1Data()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setInfoPostChart1Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  getInfoPostChart2Data(): void {
    this._infoPostService.getChart1Data()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setInfoPostChart2Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  setInfoPostChart1Data(data: any): void {
    this.infoPostChart1Options.labels = data.xaxis;
    this.infoPostChart1Options.series = data.series;
  }

  setInfoPostChart2Data(data: any): void {
    this.infoPostChart2Options.labels = data.xaxis;
    this.infoPostChart2Options.series = data.series;
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
