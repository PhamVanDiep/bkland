import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { ForumPost } from 'src/app/core/models/forum-post.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { ForumPostService } from 'src/app/core/services/forum-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-forum-post-detail-admin',
  templateUrl: './forum-post-detail.component.html',
  styleUrls: ['./forum-post-detail.component.css']
})
export class ForumPostDetailComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Chi tiết bài viết';

  forumPost: ForumPost;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _forumPostService: ForumPostService,
    private _confirmationService: ConfirmationService
  ) {
    this._appTitleService.setTitle(this.title);
    this.forumPost = {
      id: '',
      content: '',
      createAt: null,
      createBy: 'admin',
      postMedia: [],
      updateAt: null,
      updateBy: ''
    };
    this.innerWidth = window.innerWidth;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    let postId = this._route.snapshot.paramMap.get('id') || '';
    this._loadingService.loading(true);
    this._forumPostService.findById(postId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.forumPost = response.data;
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

  goBack(): void {
    this._router.navigate(['../../'], { relativeTo: this._route });
  }

  deletePost(): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc chắn muốn xóa bài viết?',
        header: 'Xóa bài viết',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this.deletePostCallAPI(this.forumPost.id);
        },
        reject: (type: any) => {
          switch(type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    )
  }

  deletePostCallAPI(postId: string): void {
    this._loadingService.loading(true);
    this._forumPostService.deletePost(postId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          this._messageService.infoMessage('Đang chuyển hướng');
          this._loadingService.loading(true);
          setTimeout(() => {
            this._loadingService.loading(false);
            this.goBack();
          }, 1500);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }
}
