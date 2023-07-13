import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexTitleSubtitle, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { ReplaySubject, takeUntil } from 'rxjs';
import { BAN_CHOTHUE_DROPDOWN } from 'src/app/core/constants/other.constant';
import { STATUS, STATUS_DROPDOWN } from 'src/app/core/constants/status.constant';
import { MONTHS } from 'src/app/core/constants/time-select.constant';
import { TYPE, TYPE_DROPDOWN_FILTER } from 'src/app/core/constants/type.constant';
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
  realEstatePostsSrc: any[];
  selectedRep: any;
  priceFluctuations: any[];

  typeOptions: any[];
  repTypeOptions: any[];
  statusOptions: any[];
  selectedType: number;
  selectedRepType: string;
  selectedStatus: string;

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

    this.typeOptions = BAN_CHOTHUE_DROPDOWN;
    this.repTypeOptions = TYPE_DROPDOWN_FILTER;
    this.statusOptions = STATUS_DROPDOWN;
    this.selectedType = -1;
    this.selectedRepType = '';
    this.selectedStatus = '';
  }

  ngOnInit(): void {
    this._loadingService.loading(true);
    this._realEstatePostService.getMostRepPriceFluctuation()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.realEstatePosts = response.data;
          this.realEstatePostsSrc = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
    setTimeout(() => {
      this._loadingService.loading(false);      
    }, 3000);
  }

  filterFunc(): void {
    this.realEstatePosts = this.realEstatePostsSrc.filter(e => {
      let valid = true;
      if (this.selectedType >= 0 && this.selectedType != 2 && ((e.sell && this.selectedType == 0) || (!e.sell && this.selectedType == 1))) {
        valid = false;
      }
      if (this.selectedRepType.length > 0 && this.selectedRepType != 'ALL' && e.type != this.selectedRepType) {
        valid = false;
      }
      if (this.selectedStatus.length > 0 && this.selectedStatus != 'ALL' && e.status != this.selectedStatus) {
        valid = false;
      }
      return valid;
    });
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
    let response = '';
    STATUS_DROPDOWN.forEach(e => {
      if (e.key == status) {
        response = e.value;
      }
    });
    return response;
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
