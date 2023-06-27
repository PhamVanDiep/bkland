import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ForumPost } from 'src/app/core/models/forum-post.model';
import { ForumPostService } from 'src/app/core/services/forum-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { MediaService } from 'src/app/core/services/media.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from 'src/app/core/services/comment.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Cộng đồng';

  forumPosts: ForumPost[];
  page: number;
  private pageSize: number = 5;
  isMore: boolean;

  retriveAvatar: any;

  displayComment: boolean;

  isLoadingMore: boolean;

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (max - pos < 150 && this.isMore && !this.isLoadingMore) {
      this.isLoadingMore = true;
      this.fetchForumPost();
    }
  }

  displayCreateReportDialog: boolean;
  selectedPostId: string;
  
  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _forumPostService: ForumPostService,
    private _userService: UserService,
    private _authService: AuthService,
    private _mediaService: MediaService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _commentService: CommentService
  ) {
    this._appTitleService.setTitle(this.title);
    this.forumPosts = [];
    this.isMore = true;
    this.page = 0;
    this.retriveAvatar = '/assets/images/user.png';
    this.displayCreateReportDialog = false;
    this.displayComment = false;
    this.isLoadingMore = false;
  }

  ngOnInit(): void {
    this._commentService.hideComment();
    this.fetchForumPost();
    if (this._authService.isAuthenticated()) {
      this._userService.getUserById()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.retriveAvatarFunc(response.data.avatarUrl);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  retriveAvatarFunc(path: string): void {
    if (path == undefined || path == null || path.length == 0) {
      this.retriveAvatar = '/assets/images/user.png'
    } else if (path.includes(environment.BASE_URL_NO_AUTH)) {
      this._mediaService.retriveImage(path)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.retriveAvatar = this._mediaService.getImgSrc(response.data);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this.retriveAvatar = path;
    }
  }

  fetchForumPost(): void {
    this._loadingService.loading(true);
    this._forumPostService.getAllPageable(this.page, this.pageSize)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        this.isLoadingMore = false;
        if (response.status === HttpStatusCode.Ok) {
          this.forumPosts = [...this.forumPosts, ...response.data];
          if (response.data.length < this.pageSize) {
            this.isMore = false;
          }
          this.page++;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  create(): void {
    if (this._authService.isAuthenticated()) {
      if (this._userService.isAdmin()) {
        this._router.navigate(['admin/post/forum/create']);
      } else {
        this._router.navigate(['user/post/forum/create']);
      }
    } else {
      this._messageService.infoMessage('Bạn cần đăng nhập để  thực hiện chức năng này');
    }
  }

  onCloseCommentDialog(): void {
    this.displayComment = false;
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
