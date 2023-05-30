import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { InfoPostResponse } from 'src/app/core/models/info-post.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info-post-detail',
  templateUrl: './info-post-detail.component.html',
  styleUrls: ['./info-post-detail.component.css']
})
export class InfoPostDetailComponent implements OnInit, OnDestroy {

  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  infoPostResponse: InfoPostResponse;
  retriveAvatar: any;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _infoPostService: InfoPostService,
    private _domSanitizer: DomSanitizer,
    private _mediaService: MediaService
  ) {
    this.retriveAvatar = '/assets/images/user.png';
    this.infoPostResponse = {
      id: 0,
      content: '',
      createAt: null,
      createBy: '',
      updateAt: null,
      updateBy: '',
      description: '',
      title: '',
      imageUrl: '',
      view: 0,
      infoType: {
        id: 0,
        name: '',
        parent: 2,
        path: '',
        createAt: null,
        createBy: '',
        updateAt: null,
        updateBy: ''
      },
      retriveImage: null,
      user: {
        id: "",
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
        createBy: "",
        createAt: null,
        updateBy: '',
        updateAt: null
      }
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    let postId = this._route.snapshot.paramMap.get('id') || '';
    if (postId == undefined || postId == null || postId.length == 0) {
      this._router.navigate(['pages/not-found']);
    }
    this._loadingService.loading(true);
    this._infoPostService.findByIdWithIncreaseView(postId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.infoPostResponse = response.data;
          this._appTitleService.setTitle(this.infoPostResponse.title);
          if (response.data.avatarUrl != undefined && response.data.avatarUrl != null && response.data.avatarUrl.length > 0) {
            if (this.infoPostResponse.user.avatarUrl.includes(environment.BASE_URL_NO_AUTH)) {
              this._mediaService.retriveImage(this.infoPostResponse.user.avatarUrl)
                .pipe(takeUntil(this._unsubscribe))
                .subscribe((response: APIResponse) => {
                  if (response.status === HttpStatusCode.Ok) {
                    this.retriveAvatar = this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${response.data.type};base64,${response.data.body}`);
                  } else {
                    this._messageService.errorMessage(response.message);
                  }
                })
            } else {
              this.retriveAvatar = this.infoPostResponse.user.avatarUrl;
            }
          }
        } else {
          this._messageService.errorMessage(response.message);
          this._router.navigate(['pages/not-found']);
        }
      })
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
