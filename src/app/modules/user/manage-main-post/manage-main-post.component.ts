import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { STATUS } from 'src/app/core/constants/status.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { RealEstatePost } from 'src/app/core/models/real-estate-post.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';

@Component({
  selector: 'app-manage-main-post',
  templateUrl: './manage-main-post.component.html',
  styleUrls: ['./manage-main-post.component.css']
})
export class ManageMainPostComponent implements OnInit, OnDestroy {

  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string  = 'Quản lý bài đăng bán/cho thuê';

  realEstatePosts: RealEstatePost[];

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _realEsatePostService: RealEstatePostService,
    private _router: Router
  ) {
    this._appTitleService.setTitle(this.title);
    this.realEstatePosts = [];
    
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._realEsatePostService.getPostdByOwnerId()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.realEstatePosts = response.data;
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message })
        }
      });
  }

  genPrice(realEstatePost: RealEstatePost): string {
    if (realEstatePost.sell) {
      return realEstatePost.price + ' tỷ VNĐ';
    }
    return realEstatePost.price + ' triệu VNĐ';
  }

  genDesc(desc: string): string {
    if (desc.length > 100) {
      return desc.slice(0, 100) + '...'
    } 
    return desc;
  }

  getStatusValue(status: string): string {
    if (status === STATUS.CHO_KIEM_DUYET) {
      return 'Chờ kiểm duyệt';
    } else if (status === STATUS.DA_KIEM_DUYET) {
      return 'Đã kiểm duyệt';
    } else if (status === STATUS.BI_TU_CHOI) {
      return 'Bị từ chối';
    } else {
      return 'Đã hết hạn';
    }
  }

  getStatusSeverity(status: string): string {
    if (status === STATUS.CHO_KIEM_DUYET) {
      return 'primary';
    } else if (status === STATUS.DA_KIEM_DUYET) {
      return 'success';
    } else if (status === STATUS.BI_TU_CHOI) {
      return 'danger';
    } else {
      return 'warning';
    } 
  }

  redirectToPost(id: string): void {
    this._router.navigate([`user/update-post/${id}`]);
  }

  createPost(): void {
    this._router.navigate(['user/create-post']);
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
