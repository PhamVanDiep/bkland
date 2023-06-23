import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administrative-view',
  templateUrl: './administrative-view.component.html',
  styleUrls: ['./administrative-view.component.css']
})
export class AdministrativeViewComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private tiltle: string = 'Thông tin chi tiết bài viết';

  postId: string;
  contact: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _realEstatePostService: RealEstatePostService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _mediaService: MediaService,
    private _clipboardService: ClipboardService,
    private _appTitleService: AppTitleService
  ) {
    this._appTitleService.setTitle(this.tiltle);
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.postId = this._route.snapshot.paramMap.get('id') || '';
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

  goBack(): void {
    history.back();
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

  copyFunc(): void {
    this._clipboardService.copyFromContent(this.contact?.phoneNumber);
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
