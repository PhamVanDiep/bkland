import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { GENDER, GENDER_LST } from 'src/app/core/constants/gender.constant';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { District } from 'src/app/core/models/district.model';
import { Province } from 'src/app/core/models/province.model';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import { UserDeviceToken } from 'src/app/core/models/user-device-token.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { Ward } from 'src/app/core/models/ward.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { PushNotificationService } from 'src/app/core/services/push-notification.service';
import { UserDeviceTokenService } from 'src/app/core/services/user-device-token.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit, OnDestroy{
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  user: UserInfo;
  deviceInfo: DeviceInfo;
  userDeviceToken: UserDeviceToken;
  userUpdate: SignUpRequest;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  displayAccountUpdate: boolean;
  selectedRole: number;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  lstGenders: any;

  constructor(
    private _userService: UserService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _userDeviceTokenService: UserDeviceTokenService,
    private _deviceDetectorService: DeviceDetectorService,
    private _pushNotificationService: PushNotificationService,
    private _noAuthService: NoAuthService
  ) {
    this.user = {
      id: '',
      accountBalance: 0,
      address: "",
      avatarUrl: "",
      dateOfBirth: "",
      district: {
        code: 'NOT_FOUND',
        administrativeUnitId: '',
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
    }
    this.userDeviceToken = {
      id: 0,
      deviceInfo: '',
      enable: false,
      logout: false,
      notifyToken: '',
      userId: '',
      createBy: '',
      createAt: null,
      updateBy: '',
      updateAt: null
    }
    this.userUpdate = {
      id: '',
      accountBalance: 0,
      address: "",
      avatarUrl: "",
      dateOfBirth: "",
      districtCode: "",
      email: "",
      enable: true,
      firstName: "",
      gender: "MALE",
      identification: "",
      lastName: "",
      middleName: "",
      password: "",
      phoneNumber: "",
      provinceCode: "",
      roles: null,
      username: "",
      wardCode: "",
      createBy: '',
      createAt: null,
      updateBy: '',
      updateAt: null
    }
    this.displayAccountUpdate = false;
    this.lstGenders = GENDER_LST;
    let _roles = (localStorage.getItem('roles') || '').split(',');
    if (_roles.includes(ROLE.ROLE_USER)) {
      this.selectedRole = 1;
    } else {
      this.selectedRole = 3;
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  async ngOnInit() {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    await firstValueFrom(this._userService.getUserInfoById().pipe(takeUntil(this._unsubscribe)))
      .then((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.user = response.data;
          if (this.user.avatarUrl == undefined || this.user.avatarUrl == null || this.user.avatarUrl.length == 0 ) {
            this.user.avatarUrl = '/assets/images/user.png'
          }
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      });

    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
    await firstValueFrom(this._userDeviceTokenService
      .getUserDeviceToken(this.user.id, this.deviceInfo.userAgent)
      .pipe(takeUntil(this._unsubscribe)))
      .then((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.userDeviceToken = response.data;
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      });

    this._loadingService.loading(false);
    this._pushNotificationService.pushNotifyToken$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: string) => {
        this.userDeviceToken.notifyToken = response;
        this.sendUpdateUserDeviceTokenRequest();
      });
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

  async getUserInfoDisplay() {
    await firstValueFrom(this._userService.getUserInfoById().pipe(takeUntil(this._unsubscribe)))
      .then((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.user = response.data;
          if (this.user.avatarUrl == undefined || this.user.avatarUrl == null || this.user.avatarUrl.length == 0 ) {
            this.user.avatarUrl = '/assets/images/user.png'
          }
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
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

  updateUserDeviceToken(): void {
    if (this.userDeviceToken.enable && this.userDeviceToken.notifyToken.length == 0) {
      this._pushNotificationService.requestPermission();
    } else {
      this.sendUpdateUserDeviceTokenRequest();
    }
  }

  sendUpdateUserDeviceTokenRequest(): void {
    this.userDeviceToken.updateBy = this.userDeviceToken.userId;
    this._userDeviceTokenService.updateUserDeviceToken(this.userDeviceToken)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }

  nullable(field: string): boolean {
    if (field != null && field.length > 0) {
      return false;
    }
    return true;
  }

  getAllProvinces(): void {
    this._noAuthService.getAllProvinces()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.provinces = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      });
  }

  getDistrictsInProvince(): void {
    this._noAuthService.getAllDistrictsInProvince(this.userUpdate.provinceCode)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.districts = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }

  getWardsInDistrict(): void {
    this._noAuthService.getAllWardsInDistrict(this.userUpdate.districtCode)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.wards = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }

  updateFunc(): void {
    this._userService.getUserById()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.userUpdate = response.data;
          this.displayAccountUpdate = true;
          if (this.user.dateOfBirth == null) {
            this.user.dateOfBirth = '';
          }
          this.getAllProvinces();
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      });
  }

  updateUserInfo(): void {
    this._loadingService.loading(true);
    this._userService.updateUser(this.userUpdate)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(true);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: response.message });
          this.displayAccountUpdate = false;
          this.getUserInfoDisplay();
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }
}
