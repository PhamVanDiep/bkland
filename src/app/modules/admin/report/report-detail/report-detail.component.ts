import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { PostReport } from 'src/app/core/models/post-report.model';
import { ReportType } from 'src/app/core/models/report-type.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PostReportService } from 'src/app/core/services/post-report.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css']
})
export class ReportDetailComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Danh sách báo cáo';

  lstReports: PostReport[];

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _postReportService: PostReportService
  ) {
    this._appTitleService.setTitle(this.title);
    this.lstReports = [];
  }

  ngOnInit(): void {
    this._loadingService.loading(true);
    let postId = this._route.snapshot.paramMap.get('id') || '';
    if (postId.length == 0) {
      this._router.navigate(['pages/not-found']);
    }
    this._postReportService.getAllReportsByPostId(postId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.lstReports = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
    // throw new Error('Method not implemented.');
  }

  getLstReportTypeName(reportTypes: ReportType[]): string {
    let result: string[] = [];
    reportTypes.forEach(e => {
      result.push(e.name);
    })
    return result.join(", ")
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
