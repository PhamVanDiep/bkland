import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { District } from 'src/app/core/models/district.model';
import { Province } from 'src/app/core/models/province.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
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

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _userService: UserService,
    private _noAuthService: NoAuthService
  ) {
    this._appTitleService.setTitle(this.title);
    let _roles = localStorage.getItem('roles');
    let roles = _roles?.split(',');
    if (!roles?.includes(ROLE.ROLE_USER)) {
      this._router.navigate(['pages/forbidden']);
    }
    this.selectedProvince = '01';
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
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

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

}
