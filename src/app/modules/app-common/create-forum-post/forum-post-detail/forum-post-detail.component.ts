import { HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { ForumPost, ForumPostLog } from 'src/app/core/models/forum-post.model';
import { ForumPostService } from 'src/app/core/services/forum-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import Util from 'src/app/core/utils/util';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-forum-post-detail',
  templateUrl: './forum-post-detail.component.html',
  styleUrls: ['./forum-post-detail.component.css']
})
export class ForumPostDetailComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  @Input() forumPost: ForumPost;
  @Input() isView: boolean;

  @Output() postIdEvent = new EventEmitter<string>();
  @Output() deleteEvent = new EventEmitter<string>();
  
  avatarRetrive: any;
  username: string;
  createAt: string;
  forumPostLog: ForumPostLog;

  private reportTitle: string;
  noReportsToolTip: string;
  items: MenuItem[];

  images: any[];
  displayCustom: boolean;
  activeIndex: number;

  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5
    },
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  liked: boolean;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _forumPostService: ForumPostService,
    private _userService: UserService,
    private _mediaService: MediaService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService
  ) {
    this.username = '';
    this.createAt = '';
    this.reportTitle = ' lượt báo cáo'
    this.forumPostLog = {
      noComments: 0,
      noLikes: 0,
      noReports: 0
    }
    this.noReportsToolTip = this.forumPostLog.noReports + this.reportTitle;
    this.items = [
      {
        label: 'Cập nhật',
        icon: 'pi pi-fw pi-pencil',
        command: () => {
          this.updatePost();
        }
      },
      {
        label: 'Xóa bài viết',
        icon: 'pi pi-fw pi-trash',
        command: () => {
          this.deletePost();
        }
      }
    ];
    this.images = [];
    this.displayCustom = false;
    this.activeIndex = 0;
    this.liked = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._userService.getUserNoAuthById(this.forumPost.createBy)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.username = response.data.firstName +
            ' ' + response.data.middleName +
            ' ' + response.data.lastName;
          this.retriveAvatar(response.data.avatarUrl);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    this.forumPost.postMedia.forEach(e => {
      this._mediaService.retriveImage(`${environment.BASE_URL_NO_AUTH}/photos/${e.id}`)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.images.push(this._mediaService.getImgSrc(response.data));
          } else {
            this._messageService.errorMessage(response.message);
          }
        });
    });

    this._forumPostService.getLog(this.forumPost.id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.forumPostLog = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    if (this._authService.isAuthenticated()) {
      this._forumPostService.isLiked(this.forumPost.id)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.liked = response.data;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }

    this.createAt = Util.setDateDiff(this.forumPost.createAt);
  }

  retriveAvatar(path: string): void {
    if (path == undefined || path == null || path.length == 0) {
      this.avatarRetrive = '/assets/images/user.png'
    } else if (path.includes(environment.BASE_URL_NO_AUTH)) {
      this._mediaService.retriveImage(path)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.avatarRetrive = this._mediaService.getImgSrc(response.data);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this.avatarRetrive = path;
    }
  }

  ngOnInit(): void {
  }

  report(): void {
    if (!this._authService.isAuthenticated()) {
      this._messageService.infoMessage("Bạn cần đăng nhập để thực hiện tính năng này.")
      return;
    }
    this.postIdEvent.next(this.forumPost.id);
  }

  updatePost(): void {
    this._router.navigate([`./update/${this.forumPost.id}`], { relativeTo: this._route })
  }

  deletePost(): void {
    this._loadingService.loading(true);
    this._forumPostService.deletePost(this.forumPost.id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  likeClicked(): void {
    if (!this._authService.isAuthenticated()) {
      this._messageService.infoMessage('Bạn cần đăng nhập để thực hiện thao tác này.');
      return;
    }
    this._forumPostService.like({ postId: this.forumPost.id })
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          if (response.data && !this.liked) {
            this.forumPostLog.noLikes++;
          } else if (!response.data && this.liked){
            this.forumPostLog.noLikes--;
          }
          this.liked = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  commentClicked(): void {

  }

  imageClick(index: number): void {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
