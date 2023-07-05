import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { GENDER_LST } from 'src/app/core/constants/gender.constant';
import { Province } from 'src/app/core/models/province.model';
import { Ward } from 'src/app/core/models/ward.model';
import { District } from 'src/app/core/models/district.model';
import { ReplaySubject, takeUntil } from 'rxjs';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { HttpStatusCode } from '@angular/common/http';
import { ROLE, ROLE_SIGN_UP } from 'src/app/core/constants/role.constant';
import * as uuid from 'uuid';
import { SpecialAccount } from 'src/app/core/models/special-account.model';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  private title: string = 'Đăng ký';
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject();

  signUpRequest: SignUpRequest;
  lstGenders: any;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  lstAccounts: any;
  selectedRole: number;
  passwordAgain: string;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _authService: AuthService,
    private _messageService: MessageService,
    private _router: Router,
    private _noAuthService: NoAuthService
  ) {
    this._appTitleService.setTitle(this.title);
    let _id = uuid.v4();
    this.signUpRequest = {
      id: _id,
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
      createBy: _id,
      createAt: null,
      updateBy: '',
      updateAt: null
    }
    this.lstGenders = GENDER_LST;
    this.provinces = [];
    this.districts = [];
    this.wards = [];
    this.lstAccounts = ROLE_SIGN_UP;
    this.selectedRole = 1;
    this.passwordAgain = '';
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this.setRole();
    this._noAuthService.getAllProvinces()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.provinces = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  getDistrictsInProvince(): void {
    this._noAuthService.getAllDistrictsInProvince(this.signUpRequest.provinceCode)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.districts = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getWardsInDistrict(): void {
    this._noAuthService.getAllWardsInDistrict(this.signUpRequest.districtCode)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.wards = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  setRole(): void {
    if (this.selectedRole === 1) {
      this.signUpRequest.roles = [
        {
          id: 1,
          name: ROLE.ROLE_USER
        }
      ]
    } else if (this.selectedRole === 3) {
      this.signUpRequest.roles = [
        {
          id: 3,
          name: ROLE.ROLE_ENTERPRISE
        }
      ]
    }
  }

  nullable(field: string): boolean {
    if (field.length > 0) {
      return false;
    }
    return true;
  }

  validPassword(): boolean {
    if (this.signUpRequest.password.length > 0 
      && this.passwordAgain.length > 0 
      && this.signUpRequest.password != this.passwordAgain) {
      return true;
    }
    return false;
  }

  disabledCheck(): boolean {
    if (this.signUpRequest.username.length <= 0
      || this.signUpRequest.email.length <= 0
      || this.signUpRequest.firstName.length <= 0
      || this.signUpRequest.address.length <= 0
      || this.signUpRequest.phoneNumber.length != 10
      || this.signUpRequest.password.length <= 0
      || this.passwordAgain.length <= 0
      || this.signUpRequest.password != this.passwordAgain) {
      return true;
    }
    if (this.selectedRole === 1) {
      if (this.signUpRequest.middleName.length <= 0
        || this.signUpRequest.lastName.length <= 0
        || this.signUpRequest.identification.length != 12
        || this.signUpRequest.dateOfBirth.length <= 0) {
        return true;
      }
    }
    return false;
  }

  register(): void {
    this._loadingService.loading(true);
    this._authService.register(this.signUpRequest)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          if (this.selectedRole === 1) {
            this._loadingService.loading(false);
            this._messageService.successMessage(response.message);
            setTimeout(() => {
              this._router.navigate(['login']);
            }, 2000);
          } else {
            let specialAccount: SpecialAccount = {
              agency: false,
              lastPaid: null,
              monthlyCharge: 100000,
              userId: this.signUpRequest.id,
              notifyBefore: 7
            }
            this._noAuthService.createSpecialAccount(specialAccount)
              .pipe(takeUntil(this._unsubscribe))
              .subscribe((response1: APIResponse) => {
                if (response1.status === HttpStatusCode.Ok) {
                  this._loadingService.loading(false);
                  this._messageService.successMessage(response1.message);
                  setTimeout(() => {
                    this._router.navigate(['login']);
                  }, 2000);
                } else {
                  this._messageService.errorMessage(response1.message);
                }
              })
          }
        } else {
          this._loadingService.loading(false);
          this._messageService.errorMessage(response.message);
        }
      })
  }

  login(): void {
    this._router.navigate(['login']);
  }
}
