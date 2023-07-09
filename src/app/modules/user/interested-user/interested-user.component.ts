import { HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interested-user',
  templateUrl: './interested-user.component.html',
  styleUrls: ['./interested-user.component.css']
})
export class InterestedUserComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe : ReplaySubject<any> = new ReplaySubject<any>();

  @Input() postId: string;
  @Output() back: EventEmitter<void> = new EventEmitter<void>();

  lstUsers: any[];

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _realEstatePostService: RealEstatePostService,
    private _clipboardService: ClipboardService,
    private _mediaService: MediaService
  ) {
    this.lstUsers = [];
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    if (this.postId != undefined && this.postId != null && this.postId.length > 0) {
      this._loadingService.loading(true);
      this._realEstatePostService.getAllInterestedUsersOfPost(this.postId)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.lstUsers = response.data;
            this.lstUsers.forEach(e => {
              if (e.avatarUrl == undefined || e.avatarUrl == null || e.avatarUrl.length == 0) {
                e.avatarRetrive = '/assets/images/user.png'
              } else if (e.avatarUrl.includes(environment.BASE_URL_NO_AUTH)) {
                this._mediaService.retriveImage(e.avatarUrl).pipe(takeUntil(this._unsubscribe))
                  .subscribe((response: APIResponse) => {
                    if (response.status === HttpStatusCode.Ok) {
                      e.avatarRetrive = this._mediaService.getImgSrc(response.data);
                    } else {
                      this._messageService.errorMessage(response.message);
                    }
                  })
              } else {
                e.avatarRetrive = e.avatarUrl;
              }
            })
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  goBack(): void {
    this.back.next();
  }

  copy(value: string): void {
    this._clipboardService.copyFromContent(value);
  }
}
