import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { About } from 'src/app/core/models/about.model';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { AboutService } from 'src/app/core/services/about.service';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Về chúng tôi';

  about: About;
  displayAboutUpdate: boolean;
  aboutUpdate: About;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _aboutService: AboutService
  ) {
    this.about = {
      id: 1,
      address: '',
      createAt: null,
      createBy: '',
      email: '',
      name: '',
      phoneNumber: '',
      updateAt: null,
      updateBy: ''
    };
    this.aboutUpdate = {
      id: 1,
      address: '',
      createAt: null,
      createBy: '',
      email: '',
      name: '',
      phoneNumber: '',
      updateAt: null,
      updateBy: ''
    };
    this.displayAboutUpdate = false;
    this._appTitleService.setTitle(this.title);
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this.getAboutData();
  }

  getAboutData(): void {
    this._aboutService.getAboutInfo()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.about = response.data;
          this.aboutUpdate = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  nullable(field: string): boolean {
    if (field != null && field.length > 0) {
      return false;
    }
    return true;
  }

  updateFunc(): void {
    this.displayAboutUpdate = true;
  }

  saveDisableCheck(): boolean {
    if (this.aboutUpdate.address == null || this.aboutUpdate.address.length == 0
      || this.aboutUpdate.email == null || this.aboutUpdate.email.length == 0
      || this.aboutUpdate.name == null || this.aboutUpdate.name.length == 0
      || this.aboutUpdate.phoneNumber == null || this.aboutUpdate.phoneNumber.length == 0) {
      return true;
    }
    return false;
  }

  updateAboutInfo(): void {
    this._loadingService.loading(true);
    this._aboutService.updateAboutInfo(this.aboutUpdate)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          this.displayAboutUpdate = false;
          this.getAboutData();
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }
}
