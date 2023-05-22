import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { InfoPost } from 'src/app/core/models/info-post.model';
import { InfoType } from 'src/app/core/models/info-type.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { InfoTypeService } from 'src/app/core/services/info-type.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-create-info-post',
  templateUrl: './create-info-post.component.html',
  styleUrls: ['./create-info-post.component.css']
})
export class CreateInfoPostComponent implements OnInit, OnDestroy{
  private _unsubscibe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Bài đăng tin tức';

  infoPost: InfoPost;
  lstInfoType: InfoType[];

  isUpdate: boolean;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _infoTypeService: InfoTypeService,
    private _infoPostService: InfoPostService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this._appTitleService.setTitle(this.title);
    this.infoPost = {
      id: 0,
      content: '',
      createAt: null,
      createBy: '',
      updateAt: null,
      updateBy: '',
      description: '',
      title: '',
      infoType: {
        id: 0,
        name: '',
        parent: 2,
        path: '',
        createAt: null,
        createBy: '',
        updateAt: null,
        updateBy: ''
      }
    }
    this.lstInfoType = [];
    if (this._router.url.includes('create-info-post')) {
      this.isUpdate = false;
    } else {
      this.isUpdate = true;
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._infoTypeService.getAll()
      .pipe(takeUntil(this._unsubscibe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.lstInfoType = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    if (this.isUpdate) {
      let postId = this._route.snapshot.paramMap.get('id') || '';
      this._infoPostService.findById(postId)
        .pipe(takeUntil(this._unsubscibe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.infoPost = response.data;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscibe.next(null);
    this._unsubscibe.complete();
  }

}
