import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { TinTucResponse } from 'src/app/core/models/info-post.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-info-post',
  templateUrl: './info-post.component.html',
  styleUrls: ['./info-post.component.css']
})
export class InfoPostComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = '';
  tinTucResponses: TinTucResponse[];
  private selectedType: number;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title = this._router.url;
    if (this.title.includes('du-an')) {
      this.selectedType = 1;
      this.title = 'Dự án';
    } else if (this.title.includes('tin-tuc')) {
      this.selectedType = 2;
      this.title = 'Tin tức';
    } else if (this.title.includes('phong-thuy')) {
      this.selectedType = 3;
      this.title = 'Phong thủy';
    } else if (this.title.includes('quy-dinh')) {
      this.selectedType = 4;
      this.title = 'Quy định';
    } else if (this.title.includes('huong-dan')) {
      this.selectedType = 5;
      this.title = 'Hướng dẫn';
    } else {
      this._router.navigate(['pages/not-found'])
    }
    this.tinTucResponses = [];
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
