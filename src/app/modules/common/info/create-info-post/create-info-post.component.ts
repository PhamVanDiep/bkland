import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { InfoPost } from 'src/app/core/models/info-post.model';
import { InfoType } from 'src/app/core/models/info-type.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { InfoTypeService } from 'src/app/core/services/info-type.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-info-post',
  templateUrl: './create-info-post.component.html',
  styleUrls: ['./create-info-post.component.css']
})
export class CreateInfoPostComponent implements OnInit, OnDestroy {
  private _unsubscibe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Bài đăng tin tức';

  infoPost: InfoPost;
  lstInfoType: InfoType[];

  isUpdate: boolean;
  isEnterprise: boolean;

  selectedFile: any;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _infoTypeService: InfoTypeService,
    private _infoPostService: InfoPostService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _mediaService: MediaService
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
      imageUrl: '',
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

    if (localStorage.getItem('roles') === ROLE.ROLE_ENTERPRISE) {
      this.isEnterprise = true;
    } else {
      this.isEnterprise = false;
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    if (!this.isEnterprise) {
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
    } else {
      this._infoTypeService.findById(1)
        .pipe(takeUntil(this._unsubscibe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.lstInfoType.push(response.data);
            this.infoPost.infoType = response.data;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }

    if (this.isUpdate) {
      let postId = this._route.snapshot.paramMap.get('id') || '';
      this._infoPostService.findById(postId)
        .pipe(takeUntil(this._unsubscibe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.infoPost = response.data;
            if (this.isEnterprise && this.infoPost.createBy === 'admin') {
              this._router.navigate(['pages/forbidden']);
            }
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile == null || this.selectedFile == undefined) {
      return;
    }
    if (Math.round(this.selectedFile.size / 1048576) > 16) {
      this.selectedFile = null;
      this._messageService.errorMessage('Kích thước ảnh tối đa là 16MB');
      return;
    }
  }

  cancelImage(): void {
    this.selectedFile = null;
  }

  async onSave() {
    // console.log(this.infoPost);
    if (!this.isUpdate) {
      this._loadingService.loading(true);
      if (this.selectedFile == undefined || this.selectedFile == null) {
        this._messageService.errorMessage('Bạn chưa chọn ảnh minh họa.');
        this._loadingService.loading(false);
        return;
      }
      let formData = new FormData();
      formData.append('title', this.selectedFile.type);
      formData.append('image', this.selectedFile, this.selectedFile.name);

      let responseImgae = await firstValueFrom(this._mediaService.postImage(formData).pipe(takeUntil(this._unsubscibe)));
      if (responseImgae.status === HttpStatusCode.Ok) {
        this.infoPost.imageUrl = environment.BASE_URL_NO_AUTH + '/photos/' + responseImgae.data;
      } else {
        this._loadingService.loading(false);
        this._messageService.errorMessage(responseImgae.message);
        return;
      }
      let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
      this.infoPost.createBy = _id;
      await firstValueFrom(this._infoPostService.create(this.infoPost).pipe(takeUntil(this._unsubscibe))) 
        .then((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this._messageService.successMessage(response.message);
            setTimeout(() => {
              this._router.navigate(['../'], { relativeTo: this._route });
            }, 500);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
        .catch((error: any) => {
          this._messageService.errorMessage(error);
        });
    } else {
      this._loadingService.loading(true);
      if (this.selectedFile != null) {
        let formData = new FormData();
        formData.append('title', this.selectedFile.type);
        formData.append('image', this.selectedFile, this.selectedFile.name);

        let responseImgae = await firstValueFrom(this._mediaService.postImage(formData).pipe(takeUntil(this._unsubscibe)));
        if (responseImgae.status === HttpStatusCode.Ok) {
          this.infoPost.imageUrl = environment.BASE_URL_NO_AUTH + '/photos/' + responseImgae.data;
        } else {
          this._loadingService.loading(false);
          this._messageService.errorMessage(responseImgae.message);
          return;
        }
      }
      let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
      this.infoPost.updateBy = _id;
      await firstValueFrom(this._infoPostService.update(this.infoPost).pipe(takeUntil(this._unsubscibe))) 
        .then((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this._messageService.successMessage(response.message);
            setTimeout(() => {
              this._router.navigate(['../../'], { relativeTo: this._route });
            }, 500);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
        .catch((error: any) => {
          this._messageService.errorMessage(error);
        });
    }
  }

  onCancel(): void {
    this._router.navigate(['../../'], { relativeTo: this._route });
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscibe.next(null);
    this._unsubscibe.complete();
  }

}
