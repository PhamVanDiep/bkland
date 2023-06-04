import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReplaySubject, filter, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { ForumPost } from 'src/app/core/models/forum-post.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
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

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (max - pos < 150 && this.isMore) {
      this.fetchForumPost();
    }
  }

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _forumPostService: ForumPostService
  ) {
    this._appTitleService.setTitle(this.title);
    this.forumPosts = [];
    this.isMore = false;
    this.page = 0;
  }

  ngOnInit(): void {
    this.fetchForumPost();
  }

  fetchForumPost(): void {
    this._loadingService.loading(true);
    this._forumPostService.findByUser(this.page, this.pageSize)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
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
}
