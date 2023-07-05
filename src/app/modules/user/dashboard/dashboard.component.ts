import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ROLE } from 'src/app/core/constants/role.constant';
import { STATUS } from 'src/app/core/constants/status.constant';
import { TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Thống kê';

  isEnterprise: boolean;
  realEstatePosts: any[];
  selectedRep: any;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _realEstatePostService: RealEstatePostService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _appTitleService: AppTitleService
  ) {
    if (localStorage.getItem('roles') === ROLE.ROLE_ENTERPRISE) {
      this.isEnterprise = true;
    } else {
      this.isEnterprise = false;
    }
    this.realEstatePosts = [];
    this._appTitleService.setTitle(this.title);
  }

  genType(type: string): string {
    if (type === TYPE.APARTMENT) {
      return 'Chung cư';
    } else if (type === TYPE.HOUSE) {
      return 'Nhà đất';
    } else {
      return 'Đất nền';
    }
  }

  getStatusValue(status: string): string {
    if (status === STATUS.CHO_KIEM_DUYET) {
      return 'Chờ kiểm duyệt';
    } else if (status === STATUS.DA_KIEM_DUYET) {
      return 'Đã kiểm duyệt';
    } else if (status === STATUS.BI_TU_CHOI) {
      return 'Bị từ chối';
    } else {
      return 'Đã hết hạn';
    }
  }

  getStatusSeverity(status: string): string {
    if (status === STATUS.CHO_KIEM_DUYET) {
      return 'primary';
    } else if (status === STATUS.DA_KIEM_DUYET) {
      return 'success';
    } else if (status === STATUS.BI_TU_CHOI) {
      return 'danger';
    } else {
      return 'warning';
    }
  }

  viewPost(): void {
    this._router.navigate([`../post/main/${this.selectedRep.id}`], { relativeTo: this._route });
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._realEstatePostService.getAllPostOfUser()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.realEstatePosts = response.data;
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
