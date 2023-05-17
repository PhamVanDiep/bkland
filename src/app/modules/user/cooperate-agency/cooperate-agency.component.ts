import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
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

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageServie: MessageService,
    private _userService: UserService
  ) {
    this._appTitleService.setTitle(this.title);
    this.isAgency = this._userService.isAgency();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    if (this.isAgency) {
      this._loadingService.loading(true);
      
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
