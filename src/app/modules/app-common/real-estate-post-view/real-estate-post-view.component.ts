import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { CAROUSEL_TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-real-estate-post-view',
  templateUrl: './real-estate-post-view.component.html',
  styleUrls: ['./real-estate-post-view.component.css'],
  providers: [
    ClipboardService
  ]
})
export class RealEstatePostViewComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Thông tin chi tiết bài viết';

  postId: string;
  contact: any;
  showPhoneNumber: boolean;
  mostInterestedType: string;

  constructor(
    private _loadingService: LoadingService,
    private _appTitleService: AppTitleService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _clipboardService: ClipboardService,
    private _realEstatePostService: RealEstatePostService,
    private _mediaService: MediaService
  ) {
    this.showPhoneNumber = false;
    this.mostInterestedType = CAROUSEL_TYPE.BEST_INTERESTED;
    this._appTitleService.setTitle(this.title);
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this.postId = this._route.snapshot.paramMap.get('id') || '';
    this.getData();
    this._router.events
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => {
        let postTmp = this._route.snapshot.paramMap.get('id') || '';
        if (this.postId != postTmp) {
          window.location.reload(); 
        }
      })
  }

  getData(): void {
    this._realEstatePostService.findContactOfPost(this.postId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.contact = response.data;
          this.retriveAvatar(this.contact?.avatarUrl);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  async retriveAvatar(path: string) {
    if (path == undefined || path == null || path.length == 0) {
      this.contact.avatarUrl = '/assets/images/user.png'
    } else if (path.includes(environment.BASE_URL_NO_AUTH)) {
      await firstValueFrom(this._mediaService.retriveImage(path).pipe(takeUntil(this._unsubscribe))) 
        .then((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.contact.avatarUrl = this._mediaService.getImgSrc(response.data);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this.contact.avatarUrl = this.contact.avatarUrl;
    }
  }

  showPhoneNumberFunc(): void {
    if (!this.showPhoneNumber) {
      this._realEstatePostService.clickUserDetail({
        postId: this.postId
      }).subscribe();
      this.showPhoneNumber = true;
    }
  }

  copyFunc(): void {
    let phoneNumber = this.showPhoneNumber ? this.contact?.phoneNumber : (this.contact?.phoneNumber.substr(0,7) + "***");
    this._clipboardService.copyFromContent(phoneNumber);
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
