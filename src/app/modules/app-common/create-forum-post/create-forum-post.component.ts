import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { POST_TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { ForumPost } from 'src/app/core/models/forum-post.model';
import { PostMedia } from 'src/app/core/models/post-media.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { ForumPostService } from 'src/app/core/services/forum-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { environment } from 'src/environments/environment';
import * as uuid from 'uuid';

@Component({
  selector: 'app-create-forum-post',
  templateUrl: './create-forum-post.component.html',
  styleUrls: ['./create-forum-post.component.css']
})
export class CreateForumPostComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private _title: string;

  isUpdate: boolean;

  forumPost: ForumPost;

  selectedFiles: any[];
  images: any[];

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
    private _mediaService: MediaService,
    private _forumPostService: ForumPostService,
    private _confirmationService: ConfirmationService,
    private _domSanitizer: DomSanitizer
  ) {
    this.innerWidth = window.innerWidth;
    this.isUpdate = false;
    if (this.isUpdate) {
      this._title = 'Cập nhật bài viết';
    } else {
      this._title = 'Tạo bài viết mới';
    }
    this._appTitleService.setTitle(this._title);
    this.forumPost = {
      id: uuid.v4(),
      content: '',
      createAt: null,
      createBy: '',
      updateAt: null,
      updateBy: '',
      postMedia: []
    };
    this.images = [];
    this.selectedFiles = [];
    if (this._router.url.includes('update')) {
      this.isUpdate = true;
    } else {
      this.isUpdate = false;
    }
  }

  async ngOnInit() {
    // throw new Error('Method not implemented.');
    if (this.isUpdate) {
      this._loadingService.loading(true);
      let postId = this._route.snapshot.paramMap.get('id') || '';
      let response = await firstValueFrom(this._forumPostService.findById(postId).pipe(takeUntil(this._unsubscribe)))
      if (response.status === HttpStatusCode.Ok) {
        this.forumPost = response.data;
        let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
        if (_id != 'admin') {
          if (_id != this.forumPost.createBy) {
            this._router.navigate(['pages/forbidden']);
          }
        }
        for (let index = 0; index < this.forumPost.postMedia.length; index++) {
          const element = this.forumPost.postMedia[index];
          let imgResponse = await firstValueFrom(this._mediaService.retriveImage(`${environment.BASE_URL_NO_AUTH}/photos/${element.id}`));
          if (imgResponse.status === HttpStatusCode.Ok) {
            this.images.push(this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${imgResponse.data.type};base64,${imgResponse.data.body}`));
          } else {
            this._messageService.errorMessage(imgResponse.message);
          }
        }
        this._loadingService.loading(false);
      } else {
        this._messageService.errorMessage(response.message);
      }
    } else {

    }
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    if (this.selectedFiles.length == 0) {
      return;
    }

    if (!this.isUpdate) {
      if (this.selectedFiles.length > 4) {
        this._messageService.warningMessage('Chỉ được chọn tối đa 4 ảnh');
        this.selectedFiles = [];
        return;
      }
    } else {
      this.images = this.images.slice(0, this.forumPost.postMedia.length);
      if (this.selectedFiles.length + this.forumPost.postMedia.length > 4) {
        this._messageService.warningMessage('Một bài đăng chỉ được tối đa 4 ảnh');
        this.selectedFiles = [];
        return;
      }
    }

    for (let index = 0; index < this.selectedFiles.length; index++) {
      const element = this.selectedFiles[index];
      if (Math.round(element.size / 1048576) > 16) {
        this.selectedFiles = [];
        return;
      }
    }

    if (!this.isUpdate) {
      this.images = [];
    }

    this.selectedFiles.forEach(e => {
      const reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = (_event) => {
        this.images.push(reader.result);
      }
    })
  }

  async onSave() {
    if (this.isUpdate) {
      this._loadingService.loading(true);
      if (this.selectedFiles.length > 0) {
        for (let index = 0; index < this.selectedFiles.length; index++) {
          const element = this.selectedFiles[index];
          let formData = new FormData();
          formData.append('title', element.type);
          formData.append('image', element, element.name);
          let response = await firstValueFrom(this._mediaService.postImage(formData).pipe(takeUntil(this._unsubscribe)));
          let img: PostMedia = {
            id: response.data,
            mediaType: element.type,
            postId: this.forumPost.id,
            postType: POST_TYPE.FORUM_POST,
            name: element.name
          }
          this.forumPost.postMedia.push(img);
        }
      }
      await firstValueFrom(this._forumPostService.update(this.forumPost).pipe(takeUntil(this._unsubscribe)))
        .then((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status == HttpStatusCode.Ok) {
            this._messageService.successMessage(response.message);
            this._messageService.infoMessage('Đang chuyển hướng');
            this._loadingService.loading(true);
            setTimeout(() => {
              this._loadingService.loading(false);
              this._router.navigate(['../../'], { relativeTo: this._route });
            }, 1500);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this._loadingService.loading(true);
      if (this.selectedFiles.length > 0) {
        for (let index = 0; index < this.selectedFiles.length; index++) {
          const element = this.selectedFiles[index];
          let formData = new FormData();
          formData.append('title', element.type);
          formData.append('image', element, element.name);
          let response = await firstValueFrom(this._mediaService.postImage(formData).pipe(takeUntil(this._unsubscribe)));
          let img: PostMedia = {
            id: response.data,
            mediaType: element.type,
            postId: this.forumPost.id,
            postType: POST_TYPE.FORUM_POST,
            name: element.name
          }
          this.forumPost.postMedia.push(img);
        }
      }
      await firstValueFrom(this._forumPostService.create(this.forumPost).pipe(takeUntil(this._unsubscribe)))
        .then((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status == HttpStatusCode.Ok) {
            this._messageService.successMessage(response.message);
            this._messageService.infoMessage('Đang chuyển hướng');
            this._loadingService.loading(true);
            setTimeout(() => {
              this._loadingService.loading(false);
              this._router.navigate(['../'], { relativeTo: this._route });
            }, 1500);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  deleteImageFunc(i: any): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc muốn xóa ảnh đã chọn?',
        header: 'Xóa ảnh',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Từ chối',
        accept: () => {
          this.deleteImage(i)
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

  deleteImage(i: any): void {
    if (i < -1) {
      return;
    }
    this.images.splice(i, 1);
    if (this.isUpdate) {
      if (i < this.forumPost.postMedia.length) {
        this._loadingService.loading(true);
        this._mediaService.deleteById(this.forumPost.postMedia[i].id)
          .pipe(takeUntil(this._unsubscribe))
          .subscribe((response: APIResponse) => {
            this._loadingService.loading(false);
            if (response.status === HttpStatusCode.Ok) {
              this._messageService.successMessage(response.message);
              this.forumPost.postMedia.splice(i, 1);
            } else {
              this._messageService.errorMessage(response.message);
            }
          })
      } else {
        let index = i - this.images.length;
        this.selectedFiles.splice(index, 1);
      }
    } else {
      this.selectedFiles.splice(i, 1);
    }
  }

  cancel(): void {
    this._router.navigate(['../../'], { relativeTo: this._route });
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
