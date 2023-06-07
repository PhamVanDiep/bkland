import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { District } from 'src/app/core/models/district.model';
import { PriceFluctuationRequest, PriceFluctuationResponse } from 'src/app/core/models/price-fluctuation.model';
import { Province } from 'src/app/core/models/province.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { PriceFluctuationService } from 'src/app/core/services/price-fluctuation.service';

@Component({
  selector: 'app-price-fluctuation',
  templateUrl: './price-fluctuation.component.html',
  styleUrls: ['./price-fluctuation.component.css']
})
export class PriceFluctuationComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Đăng ký thông báo biến động giá';

  isUpdate: boolean;

  provinces: Province[];
  districts: District[];

  selectedProvince: string;
  selectedDistricts: District[];

  userId: string = '';

  response: PriceFluctuationResponse;
  request: PriceFluctuationRequest;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _noAuthService: NoAuthService,
    private _priceFluctuationService: PriceFluctuationService,
    private _confirmationService: ConfirmationService,
  ) {
    this.innerWidth = window.innerWidth;
    this._appTitleService.setTitle(this.title);
    let roles = localStorage.getItem('roles')?.split(',');
    if (!roles?.includes(ROLE.ROLE_USER)) {
      this._router.navigate(['pages/forbidden']);
    }
    this.selectedProvince = '01';
    this.selectedDistricts = [];
    this.userId = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    this.isUpdate = false;
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._noAuthService.getAllProvinces()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.provinces = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
    this.getDistrictsInProvince();
    this._priceFluctuationService.findByUserId(this.userId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        switch (response.status) {
          case HttpStatusCode.Ok:
            this.isUpdate = true;
            this.response = response.data;
            this.selectedDistricts = this.response.districts;
            break;
          case HttpStatusCode.NoContent:
            this.isUpdate = false;
            break
          default:
            this._messageService.errorMessage(response.message);
            break;
        }
      })
  }

  getDistrictsInProvince(): void {
    this._noAuthService.getAllDistrictsInProvince(this.selectedProvince)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.districts = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  cancel(): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc muốn hủy đăng ký nhận thông báo biến động giá?',
        header: 'Hủy đăng ký',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this._loadingService.loading(true);
          this._priceFluctuationService.unregister()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this._messageService.successMessage(response.message);
                this._loadingService.loading(true);
                this._messageService.infoMessage('Đang chuyển hướng');
                setTimeout(() => {
                  this._loadingService.loading(false);
                  this._router.navigate(['../'], { relativeTo: this._route });
                }, 1500);
              } else {
                this._messageService.errorMessage(response.message);
              }
            });
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    )
  }

  onSave(): void {
    if (this.selectedDistricts.length == 0) {
      this._messageService.warningMessage('Bạn chưa chọn quận muốn đăng ký');
      return;
    }
    let districtCodes: string[] = [];
    this.selectedDistricts.forEach(e => {
      districtCodes.push(e.code);
    });

    this._loadingService.loading(true);
    if (this.isUpdate) {
      this.request = {
        userId: this.userId,
        enable: this.response.enable,
        districtPrice: 0,
        districts: districtCodes
      }
      this._priceFluctuationService.update(this.request)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this._messageService.successMessage(response.message);
            this._loadingService.loading(true);
            this._messageService.infoMessage('Đang chuyển hướng');
            setTimeout(() => {
              this._loadingService.loading(false);
              this._router.navigate(['../'], { relativeTo: this._route });
            }, 1500);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this.request = {
        userId: this.userId,
        enable: true,
        districtPrice: 0,
        districts: districtCodes
      }
      this._priceFluctuationService.insert(this.request)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this._messageService.successMessage(response.message);
            this._loadingService.loading(true);
            this._messageService.infoMessage('Đang chuyển hướng');
            setTimeout(() => {
              this._loadingService.loading(false);
              this._router.navigate(['../'], { relativeTo: this._route });
            }, 1500);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
