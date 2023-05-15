import { HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { CHARGE_STATUS } from 'src/app/core/constants/pay.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Charge } from 'src/app/core/models/charge.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { ChargeService } from 'src/app/core/services/charge.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-finance-transaction',
  templateUrl: './finance-transaction.component.html',
  styleUrls: ['./finance-transaction.component.css']
})
export class FinanceTransactionComponent implements AfterViewInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Giao dịch tài chính';

  charges: any[];

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _chargeService: ChargeService,
    private _mediaService: MediaService,
    private _domSanitizer: DomSanitizer,
    private _confirmationService: ConfirmationService
  ) {
    this._appTitleService.setTitle(this.title);
    this.charges = [];
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._chargeService.getAllCharge()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.charges = response.data;
          this.charges.forEach(e => {
            if (e.imageUrl != null && e.imageUrl.length > 0) {
              this._mediaService.retriveImage(e.imageUrl)
                .pipe(takeUntil(this._unsubscribe))
                .subscribe((response1: APIResponse) => {
                  if (response1.status === HttpStatusCode.Ok) {
                    e.src = this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${response1.data.type};base64,${response1.data.body}`);
                  }
                })
            } else {
              e.src = '';
            }
          })
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message })
        }
      })
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
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

  onRowEditClick(charge: Charge): void {
    this._confirmationService.confirm(
      {
        message: 'Cập nhật trạng thái cho đơn nạp tiền?',
        header: 'Cập nhật trạng thái',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          charge.status = CHARGE_STATUS.DA_XAC_NHAN;
          this.updateCharge(charge);
        },
        reject: (type: any) => {
          switch(type) {
            case ConfirmEventType.REJECT:
              charge.status = CHARGE_STATUS.DA_TU_CHOI;
              this.updateCharge(charge)
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    )
  }

  updateCharge(charge: Charge): void {
    this._chargeService.updateCharge(charge)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: response.message })
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message })
        }
      })
  }
}