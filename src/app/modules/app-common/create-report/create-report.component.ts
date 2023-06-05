import { HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { PostReport } from 'src/app/core/models/post-report.model';
import { ReportType } from 'src/app/core/models/report-type.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PostReportService } from 'src/app/core/services/post-report.service';
import { ReportTypeService } from 'src/app/core/services/report-type.service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  @Input() isForumPost: boolean;
  @Input() displayCreateReportDialog: boolean;
  @Input() postId: string;

  @Output() hideEvent = new EventEmitter<boolean>();

  postReport: PostReport;
  reportTypes: ReportType[];

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _postReportService: PostReportService,
    private _reportTypeService: ReportTypeService,
    private _authService: AuthService
  ) {
    this.reportTypes = [];
    this.postReport = {
      id: 0,
      isForumPost: true,
      createAt: null,
      createBy: '',
      description: '',
      postId: '',
      reportTypes: []
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    this.postReport.isForumPost = this.isForumPost;
    this.postReport.postId = this.postId;
    this.postReport.id = 0;

    this._loadingService.loading(true);
    if (this.isForumPost) {
      if (this._authService.isAuthenticated()) {
        this._reportTypeService.getAllReportTypeFR()
          .pipe(takeUntil(this._unsubscribe))
          .subscribe((response: APIResponse) => {
            this._loadingService.loading(false);
            if (response.status === HttpStatusCode.Ok) {
              this.reportTypes = response.data;
            } else {
              this._messageService.errorMessage(response.message);
            }
          })
      } else {
        this._loadingService.loading(false);
      }
    } else {
      this._reportTypeService.getAllReportTypeREP()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.reportTypes = response.data;
          } else {
            this._messageService.errorMessage(response.message);
          }
        });
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  sendReport(): void {
    this._loadingService.loading(true);
    this._postReportService.create(this.postReport)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.displayCreateReportDialog = false;
          this._messageService.successMessage(response.message);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  hideDialog(): void {
    this.hideEvent.next(true);
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
