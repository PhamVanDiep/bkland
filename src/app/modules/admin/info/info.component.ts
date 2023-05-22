import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { InfoType } from 'src/app/core/models/info-type.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { InfoTypeService } from 'src/app/core/services/info-type.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';

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

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _infoTypeService: InfoTypeService
  ) {
    this._appTitleService.setTitle(this.title);
    this.lstInfoTypeSkips = [];
    this.newInfoTypeName = '';
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
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
      })
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
}
