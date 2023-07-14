import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, filter, takeUntil } from 'rxjs';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { ForumPost } from 'src/app/core/models/forum-post.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { ForumPostService } from 'src/app/core/services/forum-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-manage-forum',
  templateUrl: './manage-forum.component.html',
  styleUrls: ['./manage-forum.component.css']
})
export class ManageForumComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Bài viết cộng đồng';

  forumPosts: ForumPost[];
  page: number;
  private pageSize: number = 10;
  isMore: boolean;
  isAdmin: boolean;

  userForumPosts: any[];

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
    private _confirmationService: ConfirmationService,
    private _commentService: CommentService
  ) {
    this.innerWidth = window.innerWidth;
    this._appTitleService.setTitle(this.title);
    this.forumPosts = [];
    this.isMore = false;
    this.page = 0;
    let roles = localStorage.getItem('roles') || '';
    if (roles === ROLE.ROLE_ADMIN) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.userForumPosts = [];
    this.displayComment = false;
    this.isLoadingMore = false;
  }

  ngOnInit(): void {
    this._commentService.hideComment();
    if (this.isAdmin) {
      this._loadingService.loading(true);
      this._forumPostService.findOfUsers()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.userForumPosts = response.data;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
    this.fetchForumPost();
  }

  fetchForumPost(): void {
    this._loadingService.loading(true);
    this._forumPostService.findByUser(this.page, this.pageSize)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        this.isLoadingMore = false;
        if (response.status === HttpStatusCode.Ok) {
          this.forumPosts = [...this.forumPosts, ...response.data];
          if (response.data.length < this.pageSize) {
            this.isMore = false;
          } else {
            this.isMore = true;
          }
          this.page++;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.forumPosts = [];
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  createPost(): void {
    this._router.navigate(['./create'], { relativeTo: this._route });
  }

  viewDetail(postId: string): void {
    this._router.navigate([`./detail/${postId}`], { relativeTo: this._route });
  }

  deleteForumPost(postId: string, isTable: boolean) {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc chắn muốn xóa bài viết?',
        header: 'Xóa bài viết',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this.deletePost(postId, isTable);
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

  onCloseCommentDialog(): void {
    this.displayComment = false;
  }

  deletePost(postId: string, isTable: boolean): void {
    this._loadingService.loading(true);
    this._forumPostService.deletePost(postId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          if (isTable) {
            this.userForumPosts = this.userForumPosts.filter(e => e.id != postId);
          } else {
            this.forumPosts = this.forumPosts.filter(e => e.id != postId);
          }
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }
}
