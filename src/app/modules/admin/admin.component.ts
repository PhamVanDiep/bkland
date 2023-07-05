import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexTitleSubtitle, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { ReplaySubject, takeUntil } from 'rxjs';
import { STATUS } from 'src/app/core/constants/status.constant';
import { MONTHS } from 'src/app/core/constants/time-select.constant';
import { TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { UserService } from 'src/app/core/services/user.service';

export interface ChartOptions {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  labels: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Thống kê';

  realEstatePosts: any[];
  selectedRep: any;
  priceFluctuations: any[];

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _appTitleService: AppTitleService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _realEstatePostService: RealEstatePostService
  ) {
    this._appTitleService.setTitle(this.title);
    this.priceFluctuations = [];
    this.realEstatePosts = [];
  }

  ngOnInit(): void {
    this._loadingService.loading(true);
    this._realEstatePostService.getMostRepPriceFluctuation()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.realEstatePosts = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
    setTimeout(() => {
      this._loadingService.loading(false);      
    }, 3000);
  }

  genType(type: string): string {
    if (type === TYPE.APARTMENT) {
      return 'Chung cư';
    } else if (type === TYPE.HOUSE) {
      return 'Nhà đất';
    } else {
      return 'Đất nền';
    }
  }

  getStatusValue(status: string): string {
    if (status === STATUS.CHO_KIEM_DUYET) {
      return 'Chờ kiểm duyệt';
    } else if (status === STATUS.DA_KIEM_DUYET) {
      return 'Đã kiểm duyệt';
    } else if (status === STATUS.BI_TU_CHOI) {
      return 'Bị từ chối';
    } else {
      return 'Đã hết hạn';
    }
  }

  getStatusSeverity(status: string): string {
    if (status === STATUS.CHO_KIEM_DUYET) {
      return 'primary';
    } else if (status === STATUS.DA_KIEM_DUYET) {
      return 'success';
    } else if (status === STATUS.BI_TU_CHOI) {
      return 'danger';
    } else {
      return 'warning';
    }
  }

  viewPost(): void {
    this._router.navigate([`../../post/main/${this.selectedRep.id}`], { relativeTo: this._route });
  }

  viewPostStatistic(): void {
    this._realEstatePostService.getPriceChartOption(this.selectedRep.id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.priceFluctuations = [];
          let length = response.data.xaxis.length;
          for (let index = 0; index < length; index++) {
            this.priceFluctuations.push({
              createAt: response.data.xaxis[index],
              price: response.data.series[index]
            });
          }
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
