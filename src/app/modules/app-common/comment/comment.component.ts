import { HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject, takeUntil } from 'rxjs';
import { POST_TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Comment, CommentResponse } from 'src/app/core/models/comment.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { environment } from 'src/environments/environment';
import Util from 'src/app/core/utils/util';
import { ConfirmEventType, ConfirmationService, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  @Input() postId: string;
  @Input() postType: string;
  @Input() display: boolean;

  @Output() hideEvent = new EventEmitter<boolean>();

  comments: CommentResponse[];
  newComment: Comment;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  items: MenuItem[];

  selectedCommentResponse: CommentResponse;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _commentService: CommentService,
    private _authService: AuthService,
    private _mediaService: MediaService,
    private _domSanitizer: DomSanitizer,
    private _confirmationService: ConfirmationService,
  ) {
    this.comments = [];
    this.initNewComment();
    this.innerWidth = window.innerWidth;
    this.items = [
      {
        label: 'Sửa bình luận',
        icon: 'pi pi-fw pi-pencil',
        command: () => {
          this.editComment();
        }
      },
      {
        label: 'Xóa bình luận',
        icon: 'pi pi-fw pi-trash',
        command: () => {
          this.deleteComment();
        }
      }
    ];
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    if (this.postType == POST_TYPE.FORUM_POST) {
      this.newComment.forumPost = true;
    } else {
      this.newComment.forumPost = false;
    }
    this._commentService.comment$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: boolean) => {
        this.display = response;
      });

    this._commentService.postId$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((rsp: string) => {
        if (rsp != undefined && rsp != null && rsp.length > 0) {
          this.initNewComment();
          this.postId = rsp;
          this.newComment.postId = this.postId;
          this._loadingService.loading(true);
          this._commentService.findAllByPostId(this.postId)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this.comments = response.data;
                this.comments.forEach(e => {
                  this.setAvatar(e);
                })
              } else {
                this._messageService.errorMessage(response.message);
              }
            });
        }
      })
  }

  initNewComment(): void {
    this.newComment = {
      id: 0,
      createAt: null,
      createBy: '',
      forumPost: this.postType == POST_TYPE.FORUM_POST ? true : false,
      postId: '',
      updateAt: null,
      updateBy: '',
      content: ''
    };
  }

  setAvatar(e: CommentResponse): void {
    if (e.avatarUrl != undefined && e.avatarUrl != null && e.avatarUrl.length > 0) {
      if (e.avatarUrl.includes(environment.BASE_URL_NO_AUTH)) {
        this._mediaService.retriveImage(e.avatarUrl)
          .pipe(takeUntil(this._unsubscribe))
          .subscribe((response1: APIResponse) => {
            if (response1.status === HttpStatusCode.Ok) {
              e.avatarUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${response1.data.type};base64,${response1.data.body}`);
            } else {
              this._messageService.errorMessage(response1.message);
            }
          })
      }
    } else {
      e.avatarUrl = "/assets/images/user.png";
    }
  }

  hideDialog(): void {
    this.hideEvent.next(true);
  }

  dayConvert(date: any): string {
    return Util.setDateDiff(date);
  }

  editComment(): void {
    if (this._authService.isAuthenticated()) {
      this.newComment.id = this.selectedCommentResponse.id;
      this.newComment.content = this.selectedCommentResponse.content;
      this.newComment.createAt = this.selectedCommentResponse.createAt;
      this.newComment.updateAt = this.selectedCommentResponse.updateAt;
      this.newComment.forumPost = this.selectedCommentResponse.forumPost;
      this.newComment.postId = this.selectedCommentResponse.postId;
      this.newComment.createBy = this.selectedCommentResponse.createBy;
      this.newComment.updateBy = this.selectedCommentResponse.updateBy;
    } else {
      this._messageService.warningMessage('Bạn không thể sửa bình luận này.');
      return;
    }
  }

  deleteComment(): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc muốn xóa bình luận này?',
        header: 'Xóa bình luận',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this._loadingService.loading(true);
          this._commentService.delete(this.selectedCommentResponse.id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this.comments = this.comments.filter(e => e.id != this.selectedCommentResponse.id);
                this._messageService.successMessage(response.message);
              } else {
                this._messageService.errorMessage(response.message);
              }
            });
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    )
  }

  sendComment(): void {
    if (this.newComment.content.length == 0) {
      this._messageService.warningMessage('Không được để trống nội dung.');
      return;
    }
    if (this.newComment.id > 0) {
      this._loadingService.loading(true);
      this._commentService.update(this.newComment)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.comments.forEach(e => {
              if (e.id == response.data) {
                e.content = this.newComment.content;
              }
            });
            this.initNewComment();
          } else {
            this._messageService.errorMessage(response.message);
          }
        });
    } else {
      if (this.postType === POST_TYPE.FORUM_POST) {
        if (!this._authService.isAuthenticated()) {
          this._messageService.warningMessage('Bạn cần đăng nhập để gửi bình luận');
          return;
        }
        this._loadingService.loading(true);
        this._commentService.authCreate(this.newComment)
          .pipe(takeUntil(this._unsubscribe))
          .subscribe((response: APIResponse) => {
            this._loadingService.loading(false);
            if (response.status === HttpStatusCode.Ok) {
              let res = response.data;
              this.setAvatar(res);
              this.comments.push(res);
            } else {
              this._messageService.errorMessage(response.message);
            }
          })
      } else {
        this._loadingService.loading(true);
        if (!this._authService.isAuthenticated()) {
          this._commentService.noAuthCreate(this.newComment)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                let res = response.data;
                this.setAvatar(res);
                this.comments.push(res);
              } else {
                this._messageService.errorMessage(response.message);
              }
            })
        } else {
          this._commentService.authCreate(this.newComment)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                let res = response.data;
                this.setAvatar(res);
                this.comments.push(res);
              } else {
                this._messageService.errorMessage(response.message);
              }
            })
        }
      }
      this.newComment.content = '';
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
