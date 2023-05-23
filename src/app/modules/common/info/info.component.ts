import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { ROLE } from 'src/app/core/constants/role.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { InfoPost } from 'src/app/core/models/info-post.model';
import { InfoType } from 'src/app/core/models/info-type.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { InfoTypeService } from 'src/app/core/services/info-type.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Tin tức';

  lstInfoTypeSkips: InfoType[];
  clonedInfoTypeSkips: { [s: number]: InfoType } = {};
  newInfoTypeName: string;

  lstInfoPosts: any[];

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  isAdmin: boolean;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _infoTypeService: InfoTypeService,
    private _infoPostService: InfoPostService,
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _confirmationService: ConfirmationService
  ) {
    this._appTitleService.setTitle(this.title);
    this.lstInfoTypeSkips = [];
    this.lstInfoPosts = [];
    this.newInfoTypeName = '';
    this.innerWidth = window.innerWidth;
    let roles = (localStorage.getItem('roles') || '').split(',');
    if (roles.includes(ROLE.ROLE_ADMIN)) {
      this.isAdmin = true;
    } else if (roles.includes(ROLE.ROLE_ENTERPRISE)) {
      this.isAdmin = false;
    } else {
      this._router.navigate(['pages/forbidden']);
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    if (this.isAdmin) {
      this._loadingService.loading(true);
      this._infoTypeService.getAllSkip()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.lstInfoTypeSkips = response.data;
          } else {
            this._messageService.errorMessage(response.message);
          }
        });
    }
    this.getLstPosts();
  }

  getLstPosts(): void {
    this._loadingService.loading(true);
    if (this.isAdmin) {
      this._infoPostService.getAll()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.lstInfoPosts = response.data;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
      this._infoPostService.findByUserId(_id)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.lstInfoPosts = response.data;
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  onRowEditInit(infoTypeSkip: InfoType) {
    this.clonedInfoTypeSkips[infoTypeSkip.id] = { ...infoTypeSkip };
  }

  onRowEditSave(infoTypeSkip: InfoType) {
    if (infoTypeSkip.name.length <= 0) {
      this._messageService.errorMessage('Không được để trống tên danh mục');
      return;
    }
    this._loadingService.loading(true);
    infoTypeSkip.path = this.removeVietnameseTones(infoTypeSkip.name);
    this._infoTypeService.update(infoTypeSkip)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          delete this.clonedInfoTypeSkips[infoTypeSkip.id];
          this._messageService.successMessage(response.message);
          infoTypeSkip = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  onRowEditCancel(infoTypeSkip: InfoType, index: number) {
    this.lstInfoTypeSkips[index] = this.clonedInfoTypeSkips[infoTypeSkip.id];
    delete this.clonedInfoTypeSkips[infoTypeSkip.id];
  }

  createInfoType(): void {
    if (this.newInfoTypeName.length <= 0) {
      this._messageService.errorMessage('Không được để trống tên danh mục');
      return;
    }
    this._loadingService.loading(true);
    let body: InfoType = {
      id: 0,
      name: this.newInfoTypeName,
      parent: 2,
      path: `${this.removeVietnameseTones(this.newInfoTypeName)}`,
      createAt: null,
      createBy: '',
      updateAt: null,
      updateBy: ''
    }
    // console.log(body);
    this._infoTypeService.create(body)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          this.lstInfoTypeSkips.push(response.data);
          this.newInfoTypeName = '';
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  deleteInfoType(infoTypeId: number) {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc chắn muốn xóa danh mục này? Việc xóa danh mục đồng thời sẽ xóa các bài đăng có danh mục đó.',
        header: 'Xóa danh mục',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this._loadingService.loading(true);
          this._infoTypeService.delete(infoTypeId)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this._messageService.successMessage(response.message);
                this.lstInfoTypeSkips = this.lstInfoTypeSkips.filter((e: InfoType) => e.id !== infoTypeId);
                this.getLstPosts();
              } else {
                this._messageService.errorMessage(response.message);
              }
            })
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

  removeVietnameseTones(str: string): string {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str.toLowerCase().split(' ').join('-');
  }

  createInfoPost(): void {
    this._router.navigate(['create-info-post'], { relativeTo: this._route });
  }

  // genCreateBy(createBy: string): string {
  //   if (createBy === 'admin') {
  //     return createBy;
  //   }
  //   let returnVal = 'Không xác định';
  //   try {
  //     this._userService.getUserInfo(createBy).pipe(takeUntil(this._unsubscribe))
  //       .subscribe((apiResponse: APIResponse) => {
  //         if (apiResponse.status === HttpStatusCode.Ok) {
  //           returnVal = apiResponse.data.firstName + ' ' + apiResponse.data.middleName + ' ' + apiResponse.data.lastName;
  //         } else {
  //           this._messageService.errorMessage(apiResponse.message);
  //         }
  //       })
  //     return returnVal;
  //   } catch (error) {
  //     return returnVal;
  //   }
  // }

  updatePost(id: number): void {
    this._router.navigate([`update-info-post/${id}`], { relativeTo: this._route });
  }

  deletePost(id: number): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc chắn muốn xóa bài viết?',
        header: 'Xóa bài viết',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Từ chối',
        accept: () => {
          this._loadingService.loading(true);
          this._infoPostService.delete(id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this._messageService.successMessage(response.message);
                this.lstInfoPosts = this.lstInfoPosts.filter((e: InfoPost) => e.id !== id);
              } else {
                this._messageService.errorMessage(response.message);
              }
            })
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
}
