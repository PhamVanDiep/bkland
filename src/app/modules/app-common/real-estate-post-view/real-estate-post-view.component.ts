import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-real-estate-post-view',
  templateUrl: './real-estate-post-view.component.html',
  styleUrls: ['./real-estate-post-view.component.css']
})
export class RealEstatePostViewComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  postId: string;

  constructor(
    private _loadingService: LoadingService,
    private _appTitleService: AppTitleService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.postId = this._route.snapshot.paramMap.get('id') || '';
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
