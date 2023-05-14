import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CHARGE_STATUS, PAY_METHOD } from 'src/app/core/constants/pay.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Charge } from 'src/app/core/models/charge.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { ChargeService } from 'src/app/core/services/charge.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.css']
})
export class ChargeComponent implements OnInit, OnDestroy{

  private title: string = 'Nạp tiền';
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  totalPay: number;
  payMethods: any;
  payMethod: string;
  selectedFile: any;
  charge: Charge;
  ipAddress: any;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _mediaService: MediaService,
    private _chargeService: ChargeService,
    private _httpClient: HttpClient
  ) {
    let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    this._appTitleService.setTitle(this.title);
    this.payMethods = [
      {
        key: PAY_METHOD.VNPAY,
        value: 'Thanh toán qua VNPay'
      },
      {
        key: PAY_METHOD.TRANSFER_CHARGE,
        value: 'Chuyển khoản'
      }
    ];
    this.selectedFile = null;
    this.charge = {
      id: 0,
      accountBalance: 0,
      chargeType: PAY_METHOD.VNPAY,
      createBy: _id,
      user: {
        id: _id,
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
      },
      createAt: null,
      imageUrl: '',
      soTien: 10000,
      status: CHARGE_STATUS.CHO_XAC_NHAN
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._httpClient.get("http://api.ipify.org/?format=json")
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: any) => {
        this.ipAddress = response.ip;
      });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile == null || this.selectedFile == undefined) {
      return;
    }
  }

  onSave(): void {
    this._loadingService.loading(true);
    if (this.charge.chargeType === PAY_METHOD.TRANSFER_CHARGE) {
      if (this.selectedFile == null) {
        this._loadingService.loading(false);
        this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Bạn chưa tải ảnh minh chứng lên.' });
        return;
      }
      let formData = new FormData();
      formData.append('title', this.selectedFile.type);
      formData.append('image', this.selectedFile, this.selectedFile.name);
      this._mediaService.postImage(formData).pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.charge.imageUrl = environment.BASE_URL_NO_AUTH + '/photos/' + response.data;
            this.callApiCharge();
          } else {
            this._loadingService.loading(false);
            this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
          }
        });
    } else {
      this._chargeService.getVnpayUrl(this.ipAddress, this.charge.user.id, this.charge.soTien)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: any) => {
          this._loadingService.loading(false);
          window.open(response.data, "_self");
        })
    }
  }

  callApiCharge(): void {
    this._chargeService.createCharge(this.charge)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this._loadingService.loading(false);
          this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: response.message });
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }
}
