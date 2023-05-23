import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmEventType, ConfirmationService, MenuItem } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GENDER } from 'src/app/core/constants/gender.constant';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Quản lý tài khoản';

  users: SignUpRequest[];
  selectedUser: SignUpRequest;
  items: MenuItem[];

  innerWidth: any;
  displayUserDetail: boolean;
  avatarUrlRetrive: any;
  user: UserInfo;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _userService: UserService,
    private _confirmationService: ConfirmationService,
    private _mediaService: MediaService,
    private _domSanitizer: DomSanitizer
  ) {
    this._appTitleService.setTitle(this.title);
    this.users = [];
    this.items = [
      {
        icon: 'pi pi-eye',
        label: 'Xem thông tin chi tiết',
        command: () => {
          this.viewInfoDetail();
        }
      },
      {
        icon: 'pi pi-lock',
        label: 'Khóa/Mở khóa tài khoản',
        command: () => {
          this.lockOrUnLock();
        }
      }
    ];
    this.displayUserDetail = false;
    this.avatarUrlRetrive = '/assets/images/user.png';
    this.user = {
      id: '',
      accountBalance: 0,
      address: "",
      avatarUrl: "",
      dateOfBirth: "",
      district: {
        code: 'NOT_FOUND',
        administrativeUnitId: 7,
        codeName: '',
        fullName: '',
        fullNameEn: '',
        name: '',
        nameEn: '',
        provinceCode: ''
      },
      email: "",
      enable: true,
      firstName: "",
      gender: "MALE",
      identification: "",
      lastName: "",
      middleName: "",
      password: "",
      phoneNumber: "",
      province: {
        administrativeRegion: '',
        administrativeUnit: '',
        code: 'NOT_FOUND',
        codeName: '',
        fullName: '',
        fullNameEn: '',
        name: '',
        nameEn: ''
      },
      roles: null,
      username: "",
      ward: {
        administrativeUnitId: '',
        code: 'NOT_FOUND',
        codeName: '',
        districtCode: '',
        fullName: '',
        fullNameEn: '',
        name: '',
        nameEn: ''
      },
      createBy: '',
      createAt: null,
      updateBy: '',
      updateAt: null
    };
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this._loadingService.loading(true);
    this._userService.getAllUsers()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.users = response.data.filter((e: SignUpRequest) => e.id !== 'admin');
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
    // throw new Error('Method not implemented.');
  }

  genRole(roles: any): string {
    let res: any[] = [];
    roles.forEach((e: any) => {
      if (e.name === ROLE.ROLE_USER) {
        res.push('Người dùng');
      } else if (e.name === ROLE.ROLE_AGENCY) {
        res.push('Môi giới');
      } else if (e.name === ROLE.ROLE_ENTERPRISE) {
        res.push('Doanh nghiệp');
      }
    })
    return res.join(", ");
  }

  viewInfoDetail(): void {
    this.displayUserDetail = true;
    this.avatarUrlRetrive = '/assets/images/user.png';
    this._userService.getUserInfo(this.selectedUser.id).pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.user = response.data;
          if (this.user.avatarUrl == undefined || this.user.avatarUrl == null || this.user.avatarUrl.length == 0) {
            this.user.avatarUrl = '/assets/images/user.png'
          } else if (this.user.avatarUrl.includes(environment.BASE_URL_NO_AUTH)) {
            this._mediaService.retriveImage(this.user.avatarUrl)
              .pipe(takeUntil(this._unsubscribe))
              .subscribe((response: APIResponse) => {
                if (response.status === HttpStatusCode.Ok) {
                  this.avatarUrlRetrive = this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${response.data.type};base64,${response.data.body}`);
                } else {
                  this._messageService.errorMessage(response.message);
                }
              })
          } else {
            this.avatarUrlRetrive = this.user.avatarUrl;
          }
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  addressOutcome(): string {
    if (this.user.province.code === 'NOT_FOUND'
      || this.user.district.code === 'NOT_FOUND'
      || this.user.ward.code === 'NOT_FOUND'
      || this.user.address.length == 0) {
      return 'Không xác định';
    }
    return this.user.address + ', '
      + this.user.ward.fullName + ', '
      + this.user.district.fullName + ', '
      + this.user.province.fullName
  }

  genderOutcome(): string {
    if (this.user.gender === GENDER.MALE) {
      return 'Nam';
    } else if (this.user.gender === GENDER.FEMALE) {
      return 'Nữ';
    } else {
      return 'Không xác định';
    }
  }

  isEnterprise(): boolean {
    let roles: any[] = this.user.roles || [];
    let res = false;
    roles.forEach(e => {
      if (e.name === ROLE.ROLE_ENTERPRISE) {
        res = true;
      }
    });
    return res;
  }

  lockOrUnLock(): void {
    this._confirmationService.confirm(
      {
        message: this.selectedUser.enable ? 'Bạn có chắc chắn khóa tài khoản này?' : 'Tài khoản này đã bị khóa. Bạn có muốn mở khóa tài khoản này?',
        header: 'Cập nhật trạng thái',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy',
        accept: () => {
          this._loadingService.loading(true);
          this._userService.updateAccountStatus(this.selectedUser.id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this._messageService.successMessage(response.message);
                this.selectedUser.enable = response.data;
              } else {
                this._messageService.errorMessage(response.message);
              }
            })
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
}
