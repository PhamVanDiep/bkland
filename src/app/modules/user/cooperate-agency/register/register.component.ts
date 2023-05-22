import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { District } from 'src/app/core/models/district.model';
import { Province } from 'src/app/core/models/province.model';
import { UserDeviceToken } from 'src/app/core/models/user-device-token.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { SpecialAccountService } from 'src/app/core/services/special-account.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Đăng ký môi giới';

  isAgency: boolean;
  provinces: Province[];
  districts: District[];

  selectedProvince: string;
  selectedDistricts: District[];

  userId: string = '';

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  deviceInfo: DeviceInfo;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _noAuthService: NoAuthService,
    private _specialAccountService: SpecialAccountService,
    private _userService: UserService,
    private _confirmationService: ConfirmationService,
    private _authService: AuthService,
    private _deviceDetectorService: DeviceDetectorService,
  ) {
    this._appTitleService.setTitle(this.title);
    let _roles = localStorage.getItem('roles');
    let roles = _roles?.split(',');
    if (!roles?.includes(ROLE.ROLE_USER)) {
      this._router.navigate(['pages/forbidden']);
    }
    this.selectedProvince = '01';
    this.selectedDistricts = [];
    this.userId = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    this.isAgency = this._userService.isAgency();
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
    if (this.isAgency) {
      this._specialAccountService.agencyInfo(this.userId)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.selectedDistricts = response.data.districts;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
  }

  getDistrictsInProvince(): void {
    this._noAuthService.getAllDistrictsInProvince(this.selectedProvince)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.districts = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  calcMonthlyPaid(): number {
    let returnVal = 0;
    this.selectedDistricts.forEach((e: District) => {
      if (e.administrativeUnitId === 5) {
        returnVal += 30000;
      } else {
        returnVal += 20000;
      }
    });
    return returnVal;
  }

  onSave(): void {
    let body = {
      userId: this.userId,
      districts: this.selectedDistricts
    }
    if (this.isAgency) {
      this._loadingService.loading(true);
      this._specialAccountService.agencyUpdate(body)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this._messageService.successMessage(response.message);
            setTimeout(() => {
              this._router.navigate(['user/cooperate-agency']);
            }, 1000);
          } else {
            this._messageService.errorMessage(response.message);
          }
        });
    } else {
      this._loadingService.loading(true);
      this._specialAccountService.agencySignUp(body)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this._messageService.successMessage(response.message);
            this._messageService.infoMessage("Đang đăng xuất");
            this._loadingService.loading(true);
            setTimeout(() => {
              this._loadingService.loading(false);
              this.logoutRequest()
            }, 1500);
          } else {
            this._messageService.errorMessage(response.message);
            this._loadingService.loading(false);
          }
        });
    }
  }

  cancel(): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc muốn hủy đăng ký trở thành môi giới?',
        header: 'Hủy đăng ký',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this._loadingService.loading(true);
          this._specialAccountService.agencyDelete(this.userId)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this._messageService.successMessage(response.message);
                this._messageService.infoMessage("Đang đăng xuất");
                this._loadingService.loading(true);
                setTimeout(() => {
                  this._loadingService.loading(false);
                  this.logoutRequest()
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

  logoutRequest(): void {
    localStorage.clear();
    let logoutRequest: UserDeviceToken = {
      id: 0,
      userId: this.userId,
      deviceInfo: this.deviceInfo.userAgent,
      enable: true,
      logout: true,
      notifyToken: '',
      createBy: '',
      createAt: null,
      updateBy: this.userId,
      updateAt: null
    }
    this._authService.logout(logoutRequest)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._router.navigate(['login']);
      });
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
