import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Charge } from 'src/app/core/models/charge.model';
import { SignUpRequest } from 'src/app/core/models/sign-up.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { ChargeService } from 'src/app/core/services/charge.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-balance-fluctuation',
  templateUrl: './balance-fluctuation.component.html',
  styleUrls: ['./balance-fluctuation.component.css']
})
export class BalanceFluctuationComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Lịch sử giao dịch';

  user: SignUpRequest;
  charges: Charge[];

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _userService: UserService,
    private _chargeService: ChargeService
  ) {
    this._appTitleService.setTitle(this.title);
    this.user = {
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
    };
    this.charges = [];
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._userService.getUserById()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.user = response.data;
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      });

    this._chargeService.getChargeByUserId()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.charges = response.data;
          console.log(this.charges);
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }

}
