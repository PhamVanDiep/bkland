import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, pipe, takeUntil } from 'rxjs';
import { REQUEST_AGENCY_STATUS } from 'src/app/core/constants/status.constant';
import { TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { RealEstatePostAgency } from 'src/app/core/models/real-estate-post-agency.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostAgencyService } from 'src/app/core/services/real-estate-post-agency.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-cooperate-agency',
  templateUrl: './cooperate-agency.component.html',
  styleUrls: ['./cooperate-agency.component.css']
})
export class CooperateAgencyComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Liên kết môi giới';

  isAgency: boolean;

  agencyRequested: any[];
  userRequestSents: any[];

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  selectedPostId: string;
  showLstInterestedUsers: boolean;
  showStatistic: boolean;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageServie: MessageService,
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _realEstatePostService: RealEstatePostService,
    private _realEstatePostAgencyService: RealEstatePostAgencyService,
    private _confirmationService: ConfirmationService
  ) {
    this._appTitleService.setTitle(this.title);
    this.isAgency = this._userService.isAgency();
    this.agencyRequested = [];
    this.innerWidth = window.innerWidth;
    this.showLstInterestedUsers = false;
    this.showStatistic = false;
  }

  ngOnInit(): void {
    if (this._userService.isEnterprise()) {
      this._router.navigate(['pages/forbidden']);
    }
    // throw new Error('Method not implemented.');
    if (this.isAgency) {
      this._loadingService.loading(true);
      this._realEstatePostService.agencyRequested()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.agencyRequested = response.data;
          } else {
            this._messageServie.errorMessage(response.message);
          }
        });
    } else {
      this._loadingService.loading(true)
      this._realEstatePostService.userRequested()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.userRequestSents = response.data;
          } else {
            this._messageServie.errorMessage(response.message);
          }
        });
    }
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

  getStatusValue(statusCode: string): string {
    if (statusCode === REQUEST_AGENCY_STATUS.DA_GUI_YEU_CAU) {
      return 'Đã gửi yêu cầu';
    } else if (statusCode === REQUEST_AGENCY_STATUS.DA_TU_CHOI) {
      return 'Đã từ chối';
    } else {
      return 'Đã xác nhận';
    }
  }

  getStatusSeverity(statusCode: string): string {
    if (statusCode === REQUEST_AGENCY_STATUS.DA_GUI_YEU_CAU) {
      return 'warning'
    } else if (statusCode === REQUEST_AGENCY_STATUS.DA_TU_CHOI) {
      return 'danger'
    } else {
      return 'success'
    }
  }

  viewPost(id: string): void {
    this._router.navigate([`./${id}`], { relativeTo: this._route });
  }

  acceptPost(rep: any): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc muốn nhận lời môi giới cho bài viết?',
        header: 'Chấp nhận yêu cầu môi giới',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this.acceptPostCallAPI(rep);
        },
        reject: (type: any) => {
          switch(type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    )
  }

  rejectPost(rep: any): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc muốn từ chối lời yêu cầu môi giới cho bài viết?',
        header: 'Từ chối yêu cầu môi giới',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy',
        accept: () => {
          this.rejectPostCallAPI(rep);
        },
        reject: (type: any) => {
          switch(type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    )
  }
  
  acceptPostCallAPI(rep: any): void {
    this.callUpdateStatusAPI(rep.repaId, REQUEST_AGENCY_STATUS.DA_XAC_NHAN);
  }

  rejectPostCallAPI(rep: any): void {
    this.callUpdateStatusAPI(rep.repaId, REQUEST_AGENCY_STATUS.DA_TU_CHOI);
  }

  callUpdateStatusAPI(repaId: number, status: string): void {
    let realEstatePostAgency: RealEstatePostAgency = {
      id: repaId,
      agencyId: '',
      createAt: null,
      createBy: '',
      updateAt: null,
      updateBy: '',
      realEstatePostId: '',
      status: status
    };
    this._realEstatePostAgencyService.update(realEstatePostAgency)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this._messageServie.successMessage(response.message);
          this.agencyRequested.forEach(e => {
            if (e.repaId == response.data) {
              e.status = status;
            }
          });
        } else {
          this._messageServie.errorMessage(response.message);
        }
      })
  }

  cancelRequest(rep: any): void {
    if (rep.status != REQUEST_AGENCY_STATUS.DA_GUI_YEU_CAU) {
      this._messageServie.errorMessage('Trạng thái bài viết đã thay đổi, bạn không thể hủy yêu cầu.');
      return;
    }
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc muốn hủy lời yêu cầu môi giới cho bài viết?',
        header: 'Hủy lời yêu cầu môi giới',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this.cancelRequestCallAPI(rep.repaId);
        },
        reject: (type: any) => {
          switch(type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    )
  }

  cancelRequestCallAPI(id: number): void {
    this._loadingService.loading(true);
    this._realEstatePostAgencyService.delete(id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response:APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageServie.successMessage(response.message);
          this.userRequestSents = this.userRequestSents.filter(e => e.repaId != id);
        } else {
          this._messageServie.errorMessage(response.message);
        }
      })
  }

  newRequest(): void {
    this._router.navigate(['./new-request'], { relativeTo: this._route });
  }

  register(): void {
    this._router.navigate(['user/cooperate-agency/register']);
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
