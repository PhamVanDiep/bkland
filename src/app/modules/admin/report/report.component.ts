import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { POST_TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { ReportType, ReportTypeResponse } from 'src/app/core/models/report-type.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PostReportService } from 'src/app/core/services/post-report.service';
import { ReportTypeService } from 'src/app/core/services/report-type.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Quản lý báo cáo';

  lstReportTypes: ReportTypeResponse[];
  newReportType: ReportType;
  clonedReportType: { [s: number]: ReportTypeResponse } = {};

  useFor: any[];

  lstPostReports: any[];
  lstPostReportsFilter: any[];
  lstPostTypeDropdown: any[];
  selectedPostType: string;

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
    private _reportTypeService: ReportTypeService,
    private _postReportService: PostReportService,
    private _router: Router,
    private _route: ActivatedRoute
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
    ];
    this.lstPostReports = [];
    this.lstPostReportsFilter = [];
    this.lstPostTypeDropdown = [
      {
        key: 'ALL',
        value: 'Tất cả'
      },
      {
        key: POST_TYPE.FORUM_POST,
        value: 'Cộng đồng'
      },
      {
        key: POST_TYPE.REAL_ESTATE_POST,
        value: 'Bán/Cho thuê'
      }
    ];
    this.selectedPostType = 'ALL';
    this.innerWidth = window.innerWidth;
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
      });

    this._postReportService.getAllStatistic()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.lstPostReports = response.data;
          this.lstPostReportsFilter = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  onRowEditInit(reportType: ReportTypeResponse) {
    this.clonedReportType[reportType.id] = { ...reportType };
  }

  onRowEditSave(reportType: ReportTypeResponse) {
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

  onRowEditCancel(reportType: ReportTypeResponse, index: number) {
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

  filterByPostType(): void {
    if (this.selectedPostType === 'ALL') {
      this.lstPostReportsFilter = this.lstPostReports;
    } else {
      this.lstPostReportsFilter = this.lstPostReports.filter(e => e.postType === this.selectedPostType);
    }
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

  viewReportsDetail(id: string): void {
    this._router.navigate([`./detail/${id}`], { relativeTo: this._route });
  }

  deleteOrHidePost(id: string): void {

  }
}
