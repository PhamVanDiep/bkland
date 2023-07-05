import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ReplaySubject, takeUntil } from 'rxjs';
import { PROJECT_ROUTE } from 'src/app/core/constants/other.constant';
import { PROJECT_TYPE, PROJECT_TYPE_DROPDOWN } from 'src/app/core/constants/project.constant';
import { CAROUSEL_TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ProjectService } from 'src/app/core/services/project.service';
import Util from 'src/app/core/utils/util';

@Component({
  selector: 'app-du-an',
  templateUrl: './du-an.component.html',
  styleUrls: ['./du-an.component.css']
})
export class DuAnComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  page: number;
  pageSize: number;
  type: string;

  lstProjects: any[];
  lstCurrProjects: any[];

  title: string;
  totalRecords: number;
  currMaxPage: number;

  duAnType: string;
  deviceInfo: DeviceInfo;

  userId: string;
  deviceInfoStr: string;

  selectedProject: any;
  preview: boolean;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _mediaService: MediaService,
    private _projectService: ProjectService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _deviceDetectorService: DeviceDetectorService
  ) {
    this.page = 0;
    this.pageSize = 10;
    this.type = '';
    this.title = '';
    this.totalRecords = 10;
    this.currMaxPage = 0;
    this.duAnType = CAROUSEL_TYPE.DU_AN;
    this.lstProjects = [];
    this.lstCurrProjects = [];
    if (this._authService.isAuthenticated()) {
      this.userId = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    } else {
      this.userId = '';
    }
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
    this.deviceInfoStr = this.deviceInfo.userAgent.replaceAll(' ', '');
    this.preview = false;
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    let path = this._router.url.split('/');
    let _type = path[path.length -1];
    switch (_type) {
      case PROJECT_ROUTE.CAN_HO_CHUNG_CU:
        this.type = PROJECT_TYPE.CAN_HO_CHUNG_CU
        break;
      case PROJECT_ROUTE.BIET_THU_LIEN_KE:
        this.type = PROJECT_TYPE.BIET_THU_LIEN_KE;
        break;
      case PROJECT_ROUTE.CAO_OC_VAN_PHONG:
        this.type = PROJECT_TYPE.CAO_OC_VAN_PHONG;
        break;
      case PROJECT_ROUTE.DU_AN_KHAC:
        this.type = PROJECT_TYPE.DU_AN_KHAC;
        break;
      case PROJECT_ROUTE.KHU_CONG_NGHIEP:
        this.type = PROJECT_TYPE.KHU_CONG_NGHIEP;
        break;
      case PROJECT_ROUTE.KHU_DO_THI_MOI:
        this.type = PROJECT_TYPE.KHU_DO_THI_MOI;
        break;
      case PROJECT_ROUTE.KHU_NGHI_DUONG_SINH_THAI:
        this.type = PROJECT_TYPE.KHU_NGHI_DUONG_SINH_THAI;
        break;
      case PROJECT_ROUTE.KHU_PHUC_HOP:
        this.type = PROJECT_TYPE.KHU_PHUC_HOP;
        break;
      case PROJECT_ROUTE.NHA_MAT_PHO:
        this.type = PROJECT_TYPE.NHA_MAT_PHO;
        break;
      case PROJECT_ROUTE.NHA_O_XA_HOI:
        this.type = PROJECT_TYPE.NHA_O_XA_HOI;
        break;
      case PROJECT_ROUTE.SHOP_HOUSE:
        this.type = PROJECT_TYPE.SHOP_HOUSE;
        break;
      case PROJECT_ROUTE.TRUNG_TAM_THUONG_MAI:
        this.type = PROJECT_TYPE.TRUNG_TAM_THUONG_MAI;
        break;
      default:
        this.type = PROJECT_TYPE.CAN_HO_CHUNG_CU
        break;
    }
    this.fetchData();
    this.setTitle();
  }

  fetchData(): void {
    this._loadingService.loading(true);
    this._projectService.findByType(this.page, this.pageSize, this.type)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          response.data.forEach((e: any) => {
            this._mediaService.getImage(e.imageUrl)
              .pipe(takeUntil(this._unsubscribe))
              .subscribe((response1: APIResponse) => {
                if (response1.status === HttpStatusCode.Ok) {
                  e.imageRetrive = this._mediaService.getImgSrc(response1.data);
                } else {
                  this._messageService.errorMessage(response1.message);
                }
              });
            this._projectService.isInterested(this.userId, e.id ,this._authService.isAuthenticated() ? '': this.deviceInfoStr)
              .pipe(takeUntil(this._unsubscribe))
              .subscribe((response2: APIResponse) => {
                if (response2.status === HttpStatusCode.Ok) {
                  e.interested = response2.data;
                } else {
                  this._messageService.errorMessage(response.message);
                }
              })
          })
          this.lstProjects = [...this.lstProjects, ...response.data];
          this.lstCurrProjects = response.data;
          if (this.lstCurrProjects.length < this.pageSize) {
            this.totalRecords = this.lstProjects.length;
          } else {
            this.totalRecords += this.pageSize;
          }
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  setTitle(): void {
    let types = PROJECT_TYPE_DROPDOWN;
    types.forEach(e => {
      if (e.key == this.type) {
        this.title = e.value;
        this._appTitleService.setTitle(e.value);
      }
    })
  }

  onPageChange(event: any): void {
    Util.scrollToTop();
    let selectedPage = event.page;
    if (selectedPage > this.currMaxPage) {
      this.fetchData();
      this.currMaxPage = selectedPage;
    } else {
      if (selectedPage == event.pageCount - 1) {
        this.lstCurrProjects = this.lstProjects.slice(selectedPage * this.pageSize, this.totalRecords + 1); 
      } else {
        this.lstCurrProjects = this.lstProjects.slice(selectedPage * this.pageSize, (selectedPage + 1) * this.pageSize); 
      }
    } 
  }

  onInterest(item: any): void {
    if (this._authService.isAuthenticated()) {
      this._projectService.userInterested({
        projectId: item?.id
      }).pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            if (response.message === "DELETED") {
              item.interested = false;
            } else {
              item.interested = true;
            }
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this._projectService.anonymousInterested({
        realEstatePostId: item?.id,
        deviceInfo: this.deviceInfoStr
      }).pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            if (response.message === "DELETED") {
              item.interested = false;
            } else {
              item.interested = true;
            }
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  navigateToDuAn(): void {
    this._router.navigate(['tien-ich/du-an']);
  }

  onCloseView(event: any): void {
    this.preview = false;
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
