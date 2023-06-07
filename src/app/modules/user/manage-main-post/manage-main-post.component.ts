import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ROLE } from 'src/app/core/constants/role.constant';
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
  items: MenuItem[];
  selectedREP: RealEstatePost;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _realEsatePostService: RealEstatePostService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _confirmationService: ConfirmationService
  ) {
    this.innerWidth = window.innerWidth;
    this._appTitleService.setTitle(this.title);
    this.realEstatePosts = [];
    this.items = [
      {
        label: 'Cập nhật',
        icon: 'pi pi-fw pi-pencil',
        command: () => {
          this.redirectToPost(this.selectedREP.id);
        }
      },
      {
        label: 'Ẩn bài viết',
        icon: 'pi pi-fw pi-eye-slash',
        command: () => {
          this.hidePost();
        }
      }
    ];
    let roles = localStorage.getItem('roles') || '';
    if (roles === ROLE.ROLE_ENTERPRISE) {
      this._router.navigate(['../info'], { relativeTo: this._route });
    }
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
          this._messageService.errorMessage(response.message);
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
    if (this.isExpire(this.selectedREP.createAt, this.selectedREP.period)) {
      this._messageService.warningMessage('Bài viết đã hết hạn, bạn không thể  thao tác thêm.');
      return;
    }
    if (!this.selectedREP.enable) {
      this._messageService.warningMessage('Bài viết đã bị ẩn, bạn không thể  thao tác thêm.');
      return;
    }
    this._router.navigate([`user/update-post/${id}`]);
  }

  createPost(): void {
    this._router.navigate(['user/create-post']);
  }

  calculateDiff(dateSent: any): number{
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - 
      Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  isExpire(createAt: any, period: number): boolean {
    if (this.calculateDiff(createAt) > period) {
      return true;
    } 
    return false;
  }

  hidePost(): void {
    if (this.isExpire(this.selectedREP.createAt, this.selectedREP.period)) {
      this._messageService.warningMessage('Bài viết đã hết hạn, bạn không thể  thao tác thêm.' );
      return;
    }
    if (!this.selectedREP.enable) {
      this._messageService.warningMessage('Bài viết đã bị ẩn, bạn không thể  thao tác thêm.');
      return;
    }

    this._confirmationService.confirm(
      {
        message: `Bạn có thực sự muốn ẩn bài viết [ ${this.selectedREP.title} ]? Sau khi ẩn, bài viết sẽ không thể  hiện lại được nữa.`,
        header: 'Xác nhận ẩn bài viết',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined p-button-danger',
        acceptLabel: 'Đồng ý',
        rejectLabel: 'Hủy',
        accept: () => {
          this.hidePostCallAPI();
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

  hidePostCallAPI(): void {
    this._loadingService.loading(true);
    this._realEsatePostService.disablePost(this.selectedREP.id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          this.selectedREP.enable = false;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
