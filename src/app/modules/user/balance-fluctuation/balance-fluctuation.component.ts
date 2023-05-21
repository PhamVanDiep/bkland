import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CHARGE_STATUS } from 'src/app/core/constants/pay.constant';
import { MONTHS } from 'src/app/core/constants/time-select.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Charge } from 'src/app/core/models/charge.model';
import { Payment } from 'src/app/core/models/payment.model';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { ChargeService } from 'src/app/core/services/charge.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-balance-fluctuation',
  templateUrl: './balance-fluctuation.component.html',
  styleUrls: ['./balance-fluctuation.component.css']
})
export class BalanceFluctuationComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Lịch sử giao dịch';

  user: SignUpRequest;
  charges: Charge[];
  chargesFilter: Charge[];

  months: any;
  years: any[];

  chargeMonth: number;
  chargeYear: number;

  paids: Payment[];
  paidsFilter: Payment[];
  paidMonth: number;
  paidYear: number;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _userService: UserService,
    private _chargeService: ChargeService,
    private _paymentService: PaymentService
  ) {
    this._appTitleService.setTitle(this.title);
    this.user = {
      id: '',
      accountBalance: 0,
      address: "",
      avatarUrl: "",
      dateOfBirth: "",
      districtCode: "",
      email: "",
      enable: true,
      firstName: "",
      gender: "MALE",
      identification: "",
      lastName: "",
      middleName: "",
      password: "",
      phoneNumber: "",
      provinceCode: "",
      roles: null,
      username: "",
      wardCode: "",
      createBy: '',
      createAt: null,
      updateBy: '',
      updateAt: null
    };
    this.charges = [];
    this.chargesFilter = [];

    this.years = [];
    this.months = MONTHS;
    let minYear = 2023;
    let currYear = new Date().getFullYear();
    for (let index = minYear; index <= currYear; index++) {
      this.years.push({
        key: index,
        value: index
      });
    }
    this.chargeMonth = 0;
    this.chargeYear = currYear;

    this.paidMonth = 0;
    this.paidYear = currYear;
    this.paids = [];
    this.paidsFilter = [];
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._userService.getUserById()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.user = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    this._chargeService.getChargeByUserId()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.charges = response.data;
          this.chargesFilter = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    this._paymentService.getAllPaidByUserId(_id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.paids = response.data;
          this.paidsFilter = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getStatusValue(statusCode: string): string {
    if (statusCode === CHARGE_STATUS.CHO_XAC_NHAN) {
      return 'Chờ xác nhận';
    } else if (statusCode === CHARGE_STATUS.DA_TU_CHOI) {
      return 'Đã từ chối';
    } else {
      return 'Đã xác nhận';
    }
  }

  getStatusSeverity(statusCode: string): string {
    if (statusCode === CHARGE_STATUS.CHO_XAC_NHAN) {
      return 'warning'
    } else if (statusCode === CHARGE_STATUS.DA_TU_CHOI) {
      return 'danger'
    } else {
      return 'success'
    }
  }

  filterChargeByMonth(): void {
    if (this.chargeMonth > 0) {
      this.chargesFilter = this.charges.filter(e => new Date(e.createAt).getMonth() + 1 === this.chargeMonth && new Date(e.createAt).getFullYear() === this.chargeYear); 
    } else {
      this.chargesFilter = this.charges.filter(e => new Date(e.createAt).getFullYear() === this.chargeYear);
    }
  }

  filterChargeByYear(): void {
    if (this.chargeMonth > 0) {
      this.chargesFilter = this.charges.filter(e => new Date(e.createAt).getMonth() + 1 === this.chargeMonth && new Date(e.createAt).getFullYear() === this.chargeYear); 
    } else {
      this.chargesFilter = this.charges.filter(e => new Date(e.createAt).getFullYear() === this.chargeYear);
    }
  }

  filterPaidByMonth(): void {
    if (this.paidMonth > 0) {
      this.paidsFilter = this.paids.filter(e => new Date(e.createAt).getMonth() + 1 === this.paidMonth && new Date(e.createAt).getFullYear() === this.paidYear); 
    } else {
      this.paidsFilter = this.paids.filter(e => new Date(e.createAt).getFullYear() === this.paidYear);
    }
  }

  filterPaidByYear(): void {
    if (this.paidMonth > 0) {
      this.paidsFilter = this.paids.filter(e => new Date(e.createAt).getMonth() + 1 === this.paidMonth && new Date(e.createAt).getFullYear() === this.paidYear); 
    } else {
      this.paidsFilter = this.paids.filter(e => new Date(e.createAt).getFullYear() === this.paidYear);
    }
  }
}
