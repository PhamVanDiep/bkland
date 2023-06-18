import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { REQUEST_AGENCY_STATUS } from 'src/app/core/constants/status.constant';
import { TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { RealEstatePostAgency } from 'src/app/core/models/real-estate-post-agency.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostAgencyService } from 'src/app/core/services/real-estate-post-agency.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { SpecialAccountService } from 'src/app/core/services/special-account.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Tạo yêu cầu giúp đỡ';

  realEstatePostAgency: RealEstatePostAgency;
  lstEnableRep: any[];
  selectedRep: any;

  lstAgencies: any[];
  selectedAgencies: any[];

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _appTitleService: AppTitleService,
    private _authService: AuthService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _realEstatePostService: RealEstatePostService,
    private _specialAccountService: SpecialAccountService,
    private _realEstatePostAgencyService: RealEstatePostAgencyService
  ) {
    this._appTitleService.setTitle(this.title);
    this.realEstatePostAgency = {
      id: 0,
      agencyId: '',
      createAt: null,
      createBy: '',
      realEstatePostId: '',
      status: REQUEST_AGENCY_STATUS.DA_GUI_YEU_CAU,
      updateAt: null,
      updateBy: ''
    };
    this.lstEnableRep = [];
    if (this._userService.isAgency()) {
      this._router.navigate(['pages/forbidden']);
    }
    this.lstAgencies = [];
    this.selectedAgencies = [];
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._realEstatePostService.enableRequest()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.lstEnableRep = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
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

  getAgencies(): void {
    this.selectedAgencies = [];
    this._loadingService.loading(true);
    this._specialAccountService.listAgencyByRepDistrict(this.selectedRep.id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.lstAgencies = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  sendRequest(): void {
    if (this.selectedAgencies == null || this.selectedAgencies.length == 0 || this.selectedRep == null) {
      this._messageService.warningMessage('Bạn chưa chọn đầy đủ thông tin được yêu cầu');
      return;
    }
    this._loadingService.loading(true);
    let _agencies: any[] = [];
    this.selectedAgencies.forEach(e => {
      _agencies.push(e.id);
    });
    let body = {
      realEstatePostId: this.selectedRep.id,
      agencies: _agencies
    }
    this._realEstatePostAgencyService.create(body)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          this._messageService.infoMessage('Đang chuyển hướng');
          this._loadingService.loading(true);
          setTimeout(() => {
            this._loadingService.loading(false);
            this._router.navigate(['../'], { relativeTo: this._route });
          }, 1500);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  cancel(): void {
    this._router.navigate(['../'], { relativeTo: this._route });
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
