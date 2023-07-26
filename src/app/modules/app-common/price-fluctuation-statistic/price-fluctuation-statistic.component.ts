import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { ChartOptions } from '../../admin/admin.component';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { HttpStatusCode } from '@angular/common/http';
import { TYPE, TYPE_DROPDOWN } from 'src/app/core/constants/type.constant';
import { Province } from 'src/app/core/models/province.model';
import { District } from 'src/app/core/models/district.model';
import { Ward } from 'src/app/core/models/ward.model';
import { MONTHS } from 'src/app/core/constants/time-select.constant';
import { NoAuthService } from 'src/app/core/services/no-auth.service';

@Component({
  selector: 'app-price-fluctuation-statistic',
  templateUrl: './price-fluctuation-statistic.component.html',
  styleUrls: ['./price-fluctuation-statistic.component.css']
})
export class PriceFluctuationStatisticComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  loading: boolean;
  chartTitle: string;
  chartOptions: ChartOptions;

  sell: number;
  type: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  month: number;
  year: number;

  lstDanhMuc: any[];
  lstLoaiBDS: any[];
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  months: any[];
  years: any[];
  
  constructor(
    private _messageService: MessageService,
    private _realEstatePostService: RealEstatePostService,
    private _noAuthService: NoAuthService
  ) {
    this.type = TYPE.HOUSE;
    this.sell = 1;
    this.provinceCode = '01';
    this.wardCode = '';
    this.districtCode = '';
    this.month = (new Date()).getMonth() + 1;
    this.year = new Date().getFullYear();
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
    this.provinces = [];
    this.districts = [];
    this.wards = [];
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
    this.chartTitle = 'Biểu đồ thống kê biến động giá';
    this.chartOptions = {
      chart: {
        type: 'line',
        width: '100%',
        height: window.innerWidth >= 1024 ? '400px' : 'auto'
      },
      dataLabels: {
      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {
        labels: {
          formatter: (value) => {
            return value?.toFixed(2);
          }
        }
      }
    };
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.getChartData();
    this._noAuthService.getAllProvinces()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.provinces = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
    this.getDistrictsInProvince();
  }

  getDistrictsInProvince(): void {
    this._noAuthService.getAllDistrictsInProvince(this.provinceCode)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.districts = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getWardsInDistrict(): void {
    if (this.districtCode != null && this.districtCode.length > 0) {
      this._noAuthService.getAllWardsInDistrict(this.districtCode)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.wards = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      }) 
    } else {
      this.wards = [];
    }
  }


  getChartData(): void {
    this.loading = true;
    this._realEstatePostService.getPriceFluctuationStatistic(
      this.sell, 
      this.type, 
      this.provinceCode, 
      (this.districtCode != null && this.districtCode.length > 0) ? this.districtCode : '', 
      (this.wardCode != null && this.wardCode.length > 0) ? this.wardCode : '', 
      this.month == null ? 0 : this.month, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setChartOptions(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  setChartOptions(data: any): void {
    this.chartTitle = ``
    this.chartOptions.xaxis = {
      categories: data.xaxis,
      title: {
        text: this.month != 0 ? 'Ngày' : 'Tháng'
      }
    }
    if (this.wardCode != null && this.wardCode.length > 0) {
      this.chartOptions.chart.type = 'bar';
      data.series[0].name = this.wards.filter(e => e.code == this.wardCode)[0].name;
    } else {
      this.chartOptions.chart.type = 'line';
    }
    this.chartOptions.series = data.series;
    this.loading = false;
  }

  getChartTitle(): string {
    this.chartTitle = 'Giá trung bình ';
    if (this.type == TYPE.HOUSE && this.sell == 1) {
      this.chartTitle += 'Bán nhà đất ';
    } else if (this.type == TYPE.APARTMENT && this.sell == 1) {
      this.chartTitle += 'Bán chung cư ';
    } else if (this.type == TYPE.PLOT && this.sell == 1) {
      this.chartTitle += 'Bán đất nền ';
    } else if (this.type == TYPE.HOUSE && this.sell == 0) {
      this.chartTitle += 'Cho thuê nhà đất ';
    } else if (this.type == TYPE.APARTMENT && this.sell == 0) {
      this.chartTitle += 'Cho thuê chung cư ';
    } else {
      this.chartTitle += 'Cho thuê đất nền ';
    }
    if (this.provinces.length > 0) {
      this.chartTitle += this.provinces.filter(e => e.code == this.provinceCode)[0].fullName; 
    }
    if (this.districtCode != null && this.districtCode.length > 0) {
      this.chartTitle += ', ' + this.districts.filter(e => e.code == this.districtCode)[0].fullName;
    }
    if (this.wardCode != null && this.wardCode.length > 0) {
      this.chartTitle += ', ' + this.wards.filter(e => e.code == this.wardCode)[0].fullName;
    }
    this.chartTitle += ' ';
    this.chartTitle += (this.month != null && this.month != 0 ) ? ('tháng ' + this.month + ' ') : '';
    this.chartTitle += `năm ${this.year}`;
    if (this.sell == 1) {
      this.chartTitle += ' (tỷ đồng / m2)';
    } else {
      this.chartTitle += ' (triệu đồng / m2)';
    }
    return this.chartTitle;
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
