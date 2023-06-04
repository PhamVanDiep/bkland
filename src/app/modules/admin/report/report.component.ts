import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { ReportType } from 'src/app/core/models/report-type.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ReportTypeService } from 'src/app/core/services/report-type.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Quản lý báo cáo';

  lstReportTypes: ReportType[];
  newReportType: ReportType;
  clonedReportType: { [s: number]: ReportType } = {};

  useFor: any[];

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }
  
  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private _reportTypeService: ReportTypeService
  ) {
    this._appTitleService.setTitle(this.title);
    this.lstReportTypes = [];
    this.newReportType = {
      id: 0,
      name: '',
      forum: true,
      createBy: '',
      createAt: null,
      updateBy: '',
      updateAt: null
    }
    this.useFor = [
      {
        key: 1,
        value: 'Cộng đồng'
      },
      {
        key: 0,
        value: 'Bán/Cho thuê'
      }
    ]
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._reportTypeService.getAll()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.lstReportTypes = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  onRowEditInit(reportType: ReportType) {
    this.clonedReportType[reportType.id] = { ...reportType };
  }

  onRowEditSave(reportType: ReportType) {
    if (reportType.name.length <= 0) {
      this._messageService.errorMessage('Không được để trống tên danh mục');
      return;
    }
    this._loadingService.loading(true);
    this._reportTypeService.update(reportType)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          delete this.clonedReportType[reportType.id];
          this._messageService.successMessage(response.message);
          reportType = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  onRowEditCancel(reportType: ReportType, index: number) {
    this.lstReportTypes[index] = this.clonedReportType[reportType.id];
    delete this.clonedReportType[reportType.id];
  }

  deleteReportType(infoTypeId: number) {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc chắn muốn xóa danh mục này? Việc xóa danh mục đồng thời sẽ xóa các báo cáo được gán danh mục đó.',
        header: 'Xóa danh mục',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this._loadingService.loading(true);
          this._reportTypeService.delete(infoTypeId)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this._messageService.successMessage(response.message);
                this.lstReportTypes = this.lstReportTypes.filter(e => e.id !== infoTypeId);
                this.getLstReports();
              } else {
                this._messageService.errorMessage(response.message);
              }
            })
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

  getLstReports(): void {

  }

  createReportType(): void {
    if (this.newReportType.name.length <= 0) {
      this._messageService.errorMessage('Không được để trống tên danh mục');
      return;
    }
    this._loadingService.loading(true);
    this._reportTypeService.create(this.newReportType)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          this.lstReportTypes.push(response.data);
          this.newReportType.name = '';
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
