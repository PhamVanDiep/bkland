import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CHARGE_STATUS, PAY_METHOD } from 'src/app/core/constants/pay.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Charge } from 'src/app/core/models/charge.model';
import { ChargeService } from 'src/app/core/services/charge.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-vnpay-success',
  templateUrl: './vnpay-success.component.html',
  styleUrls: ['./vnpay-success.component.css']
})
export class VnpaySuccessComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  charge: Charge;
  isSuccess: boolean;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _chargeService: ChargeService
  ) {
    this.isSuccess = false;
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._route.queryParams.pipe(takeUntil(this._unsubscribe))
      .subscribe((params: any) => {
        let amount = params.vnp_Amount;
        let userId = params.vnp_OrderInfo;
        if (amount == undefined
          || amount == null
          || userId == undefined
          || userId == null) {
            this._loadingService.loading(false);
          this._router.navigate(['']);
        }
        this.charge = {
          id: 0,
          accountBalance: 0,
          chargeType: PAY_METHOD.VNPAY,
          createAt: null,
          createBy: userId,
          imageUrl: '',
          soTien: amount / 100,
          status: CHARGE_STATUS.DA_XAC_NHAN,
          user: {
            id: userId,
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
          }
        }
        this._chargeService.createCharge(this.charge)
          .pipe(takeUntil(this._unsubscribe))
          .subscribe((response1: APIResponse) => {
            this._loadingService.loading(false);
            if (response1.status === HttpStatusCode.Ok) {
              this.isSuccess = true;
            } else {
              this._messageService.errorMessage(response1.message);
            }
          })
      })
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  backHome(): void {
    this._router.navigate(['../home']);
  }
}
