import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { STATUS, STATUS_DROPDOWN } from 'src/app/core/constants/status.constant';
import { TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { RealEstatePost } from 'src/app/core/models/real-estate-post.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { SocketioService } from 'src/app/core/services/socketio.service';

@Component({
  selector: 'app-main-post',
  templateUrl: './main-post.component.html',
  styleUrls: ['./main-post.component.css']
})
export class MainPostComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Bài viết bán/cho thuê';

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  items: MenuItem[];

  realEstatePosts: any[];
  realEstatePostsSrc: any[];
  selectedRep: any;

  lstStatusDropdown: any[];
  selectedStatus: string;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _realEstatePostService: RealEstatePostService,
    private _confirmationService: ConfirmationService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _socketService: SocketioService
  ) {
    this._appTitleService.setTitle(this.title);
    this.items = [
      {
        label: 'Xem bài viết',
        icon: 'pi pi-info-circle',
        command: () => {

        }
      },
      {
        label: 'Ẩn/Hiện bài viết',
        icon: 'pi pi-eye',
        command: () => {
          this.showOrHidePost();
        }
      },
      {
        label: 'Chấp nhận/Từ chối bài viết',
        icon: 'pi pi-check',
        command: () => {
          this.acceptOrRejectPost();
        }
      }
    ];
    this.realEstatePosts = [];
    this.innerWidth = window.innerWidth;
    this.lstStatusDropdown = STATUS_DROPDOWN;
    this.selectedStatus = '';
    this.realEstatePostsSrc = [];
  }

  ngOnInit(): void {
    this._socketService.connect();
    this._socketService.joinNewRepConversation();
    // throw new Error('Method not implemented.');

    this._loadingService.loading(true);
    this._realEstatePostService.getAllPost()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.realEstatePostsSrc = response.data;
          this.realEstatePosts = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    this.fetchPost(null);
  }

  genType(type: string): string {
    if (type === TYPE.APARTMENT) {
      return 'Chung cư';
    } else if (type === TYPE.HOUSE) {
      return 'Nhà đất';
    } else {
      return 'Đất nền';
    }
  }

  getStatusValue(status: string): string {
    let response = '';
    STATUS_DROPDOWN.forEach(e => {
      if (e.key == status) {
        response = e.value;
      }
    });
    return response;
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

  viewPost(): void {
    this._router.navigate([`./${this.selectedRep.id}`], { relativeTo: this._route });
  }

  showOrHidePost(): void {
    if (this.selectedRep.status !== STATUS.DA_KIEM_DUYET) {
      this._messageService.warningMessage('Chỉ có thể ấn/hiện bài viết khi bài viết đang ở trạng thái đã kiểm duyệt.');
      return;
    }
    this._confirmationService.confirm(
      {
        message: this.selectedRep.enable ? 'Bạn có chắc chắn ẩn bài viết này?' : 'Bài viết này đã bị ẩn. Bạn có muốn hiện bài viết này?',
        header: 'Cập nhật trạng thái',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy',
        accept: () => {
          this._loadingService.loading(true);
          this._realEstatePostService.disableOrEnablePost(this.selectedRep.id)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this._messageService.successMessage(response.message);
                this.selectedRep.enable = response.data;
              } else {
                this._messageService.errorMessage(response.message);
              }
            });
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
    );
  }

  acceptOrRejectPost(): void {
    if (this.selectedRep.status === STATUS.DA_HET_HAN) {
      this._messageService.warningMessage('Bài viết đã hết hạn nên không thể cập nhật trạng thái.');
      return;
    }
    if (!this.selectedRep.enable && this.selectedRep.status !== STATUS.CHO_KIEM_DUYET) {
      this._messageService.warningMessage('Bài viết đã bị ẩn nên không thể cập nhật trạng thái.');
      return;
    }

    this._confirmationService.confirm(
      {
        message: this.genMessage(),
        header: 'Cập nhật trạng thái',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined',
        acceptLabel: 'Xác nhận',
        rejectLabel: this.selectedRep.status === STATUS.CHO_KIEM_DUYET ? 'Từ chối' : 'Hủy',
        accept: () => {
          this._loadingService.loading(true);
          let statusReq = '';
          if (this.selectedRep.status === STATUS.CHO_KIEM_DUYET || this.selectedRep.status === STATUS.BI_TU_CHOI) {
            statusReq = STATUS.DA_KIEM_DUYET;
          } else {
            statusReq = STATUS.BI_TU_CHOI;
          }
          this._realEstatePostService.updatePostStatus({
            postId: this.selectedRep.id,
            status: statusReq
          })
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                this._messageService.successMessage(response.message);
                this.selectedRep.status = response.data;
                this._socketService.sendNewRep(this.selectedRep);
              } else {
                this._messageService.errorMessage(response.message);
              }
            });
        },
        reject: (type: any) => {
          switch(type) {
            case ConfirmEventType.REJECT:
              if (this.selectedRep.status === STATUS.CHO_KIEM_DUYET) {
                this._loadingService.loading(true);
                this._realEstatePostService.updatePostStatus({
                  postId: this.selectedRep.id,
                  status: STATUS.BI_TU_CHOI
                })
                  .pipe(takeUntil(this._unsubscribe))
                  .subscribe((response: APIResponse) => {
                    this._loadingService.loading(false);
                    if (response.status === HttpStatusCode.Ok) {
                      this._messageService.successMessage(response.message);
                      this.selectedRep.status = response.data;
                    } else {
                      this._messageService.errorMessage(response.message);
                    }
                  });
              }
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    );
  }

  genMessage(): string {
    if (this.selectedRep.status === STATUS.DA_KIEM_DUYET) {
      return 'Bạn có chắc chắn từ chối bài viết này?';
    } else if (this.selectedRep.status === STATUS.BI_TU_CHOI) {
      return 'Bạn có chắc chắn chấp nhận bài viết này?';
    } else {
      return 'Bạn muốn chấp nhận hay từ chối bài viết này?';
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
    this._socketService.disconnect();
    this._socketService.leaveNewRepConversation();
  }

  filterByStatus(): void {
    if (this.selectedStatus != 'ALL') {
      this.realEstatePosts = this.realEstatePostsSrc.filter(e => e.status == this.selectedStatus); 
    } else {
      this.realEstatePosts = this.realEstatePostsSrc;
    }
  }

  fetchPost(event: any): void {
    let first = 0;
    let rows = 10;
    if (event != null) {
      first = event.first;
      rows = event.rows;
    }
    this._realEstatePostService.getAllPostPaginator(first, rows)
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
}
