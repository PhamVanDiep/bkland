import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CAROUSEL_TYPE, TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { SearchRequest } from 'src/app/core/models/real-estate-post.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import Util from 'src/app/core/utils/util';

@Component({
  selector: 'app-danh-muc',
  templateUrl: './danh-muc.component.html',
  styleUrls: ['./danh-muc.component.css']
})
export class DanhMucComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  title: string;

  sell: boolean;
  type: string;
  deviceInfo: DeviceInfo;
  userId: string;
  realEstatePosts: any[];
  currRealEstatePosts: any[];
  limit: number;
  offset: number;
  totalRecords: number;
  first: number;
  currMaxPage: number;
  duAnType: string;

  isSearch: boolean;
  searchRequest: SearchRequest;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _realEstatePostService: RealEstatePostService,
    private _deviceDetectorService: DeviceDetectorService,
    private _authService: AuthService
  ) {
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
    if (this._authService.isAuthenticated()) {
      this.userId = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    } else {
      this.userId = '';
    }
    this.realEstatePosts = [];
    this.limit = 10;
    this.offset = 0;
    this.totalRecords = 0;
    this.first = 0;
    this.currMaxPage = 0;
    this.duAnType = CAROUSEL_TYPE.DU_AN;

    if (this._router.url == '/tim-kiem') {
      this.isSearch = true;
    } else {
      this.isSearch = false;
    }
    this.title = '';
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    switch (this._router.url) {
      case '/mua-ban/nha-dat':
        this.sell = true;
        this.type = TYPE.HOUSE;
        this.title = 'Mua bán nhà đất'
        this._appTitleService.setTitle(this.title);
        break;
      case '/mua-ban/chung-cu':
        this.sell = true;
        this.type = TYPE.APARTMENT;
        this.title = 'Mua bán chung cư';
        this._appTitleService.setTitle(this.title);
        break;
      case '/mua-ban/dat-nen':
        this.sell = true;
        this.type = TYPE.PLOT;
        this.title = 'Mua bán đất nền'
        this._appTitleService.setTitle(this.title);
        break;
      case '/cho-thue/nha-dat':
        this.sell = false;
        this.type = TYPE.HOUSE;
        this.title = 'Cho thuê nhà đất'
        this._appTitleService.setTitle(this.title);
        break;
      case '/cho-thue/chung-cu':
        this.sell = false;
        this.type = TYPE.APARTMENT;
        this.title = 'Cho thuê chung cư';
        this._appTitleService.setTitle(this.title);
        break;
      case '/tim-kiem':
        this.title = 'Kết quả tìm kiếm';
        this._appTitleService.setTitle(this.title);
        break;
      default:
        this.sell = true;
        this.type = TYPE.HOUSE;
        this.title = 'Mua bán nhà đất'
        this._appTitleService.setTitle(this.title);
        break;
    }
    this._loadingService.loading(true);
    if (!this.isSearch) {
      this.getTotalRecords();
      this.getReps();
    } else {
      this.totalRecords = 20;
      this._realEstatePostService.searchBody$
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((searchRequest: SearchRequest) => {
          if (searchRequest != null && this.isSearch) {
            this.searchRequest = searchRequest;
            this.search();
          } else {
            this._loadingService.loading(false);
            this._messageService.errorMessage('Không tìm thấy thông tin yêu cầu tìm kiếm');
            this.totalRecords = 0;
          }
        })
    }
  }

  getTotalRecords(): void {
    this._realEstatePostService.countTotalBySellAndTypeClient(this.sell ? 1 : 0, this.type)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.totalRecords = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  search(): void {
    this._loadingService.loading(true);
    this._realEstatePostService.search(this.searchRequest)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.realEstatePosts = [...this.realEstatePosts, ...response.data];
          if (response.data.length < 10) {
            this.totalRecords = this.realEstatePosts.length;
          } else {
            this.totalRecords = this.realEstatePosts.length + 10;
          }
          this.currRealEstatePosts = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getReps(): void {
    this._loadingService.loading(true);
    let _deviceInfo = '';
    if (!this._authService.isAuthenticated()) {
      _deviceInfo = this.deviceInfo.userAgent.replaceAll(' ', '');
    } 
    this._realEstatePostService.detailPageData(this.sell ? 1 : 0, this.type, this.limit, this.offset, this.userId, _deviceInfo)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.realEstatePosts = [...this.realEstatePosts, ...response.data];
          this.currRealEstatePosts = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  onPageChange(event: any): void {
    Util.scrollToTop();
    let selectedPage = event.page;
    if (selectedPage > this.currMaxPage) {
      this.offset = selectedPage*this.limit;
      if (this.isSearch) {
        this.searchRequest.offset = this.offset;
        this.search();
      } else {
        this.getReps(); 
      }
      this.currMaxPage = selectedPage;
    } else {
      if (selectedPage == event.pageCount - 1) {
        this.currRealEstatePosts = this.realEstatePosts.slice(selectedPage*this.limit, this.totalRecords + 1); 
      } else {
        this.currRealEstatePosts = this.realEstatePosts.slice(selectedPage*this.limit, (selectedPage + 1)*this.limit); 
      }
    } 
  }

  viewDetail(event: any): void {
    this._router.navigate([`./${event}`], { relativeTo: this._route });
  }

  navigateToDuAn(): void {
    this._router.navigate(['tien-ich/du-an']);
  }
  
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
