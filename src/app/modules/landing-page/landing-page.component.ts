import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as e from 'express';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ReplaySubject, takeUntil } from 'rxjs';
import { DIRECTION_DROPDOWN } from 'src/app/core/constants/direction.constant';
import { CAROUSEL_TYPE, TYPE_DROPDOWN } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { District } from 'src/app/core/models/district.model';
import { Province } from 'src/app/core/models/province.model';
import { SearchRequest } from 'src/app/core/models/real-estate-post.model';
import { Ward } from 'src/app/core/models/ward.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy{

  private _unsubscibe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = "Bkland";

  lstDanhMuc: any[];
  lstLoaiBDS: any[];
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  lstDirections: any[];

  searchRequest: SearchRequest;

  firstImageRetrive: any;
  firstInfoPost: any;
  lstInfoPosts: any[];

  firstDuAnImageRetrive: any;
  firstDuAnInfoPost: any;
  lstDuAnInfoPosts: any[];

  mostViewType: string;
  mostInterestedType: string;

  deviceInfo: DeviceInfo;

  showSearchPopup: boolean;
  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (window.innerWidth > 1024) {
      this.showSearchPopup = false;
    } 
  }

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _infoPostService: InfoPostService,
    private _mediaService: MediaService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _noAuthService: NoAuthService,
    private _appTitleService: AppTitleService,
    private _authService: AuthService,
    private _deviceDetectorService: DeviceDetectorService,
    private _realEstatePostService: RealEstatePostService
  ) {
    this._appTitleService.setTitle(this.title);

    this.lstInfoPosts = [];
    this.lstInfoPosts = [];
    this.mostViewType = CAROUSEL_TYPE.BEST_VIEW;
    this.mostInterestedType = CAROUSEL_TYPE.BEST_INTERESTED;

    // khoi tao request body tim kiem
    this.lstDanhMuc = [
      {
        key: 1,
        value: "Bán"
      },
      {
        key: 0,
        value: "Cho thuê"
      }
    ];
    this.lstDirections = DIRECTION_DROPDOWN;
    this.lstLoaiBDS = TYPE_DROPDOWN;
    this.provinces = [];
    this.districts = [];
    this.wards = [];

    this.showSearchPopup = false;
    this.initSearchRequest();
  }

  initSearchRequest(): void {
    this.searchRequest = {
      direction: [],
      districtCode: [],
      endArea: null,
      endPrice: null,
      keyword: null,
      limit: 10,
      noOfBedrooms: [],
      offset: 0,
      provinceCode: null,
      sell: 1,
      startArea: null,
      startPrice: null,
      type: null,
      wardCode: [],
      userId: '',
      deviceInfo: ''
    }
  }

  initUserIdAndDeviceInfoValue(): void {
    if (this._authService.isAuthenticated()) {
      this.searchRequest.userId = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
      this.searchRequest.deviceInfo = '';
    } else {
      this.searchRequest.deviceInfo = this.deviceInfo.userAgent.replaceAll(' ', '');
      this.searchRequest.userId = 'anonymous';
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);

    this._infoPostService.getHomePagePosts()
      .pipe(takeUntil(this._unsubscibe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.firstInfoPost = response.data[0];
          response.data.forEach((e: any) => {
            this._mediaService.retriveImage(e.imageUrl)
              .pipe(takeUntil(this._unsubscibe))
              .subscribe((response1: APIResponse) => {
                if (response1.status === HttpStatusCode.Ok) {
                  e.imageRetrive = this._mediaService.getImgSrc(response1.data);
                  if (e.id == this.firstInfoPost.id) {
                    this.firstImageRetrive = e.imageRetrive;
                  }
                } else {
                  this._messageService.errorMessage(response1.message);
                }
              })
          })
          this.lstInfoPosts = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    this._infoPostService.getHomePageDuAnPosts()
      .pipe(takeUntil(this._unsubscibe))
      .subscribe((response: APIResponse) => {
        if (response.status == HttpStatusCode.Ok) {
          this.firstDuAnInfoPost = response.data[0];
          response.data.forEach((e: any) => {
            this._mediaService.retriveImage(e.imageUrl)
              .pipe(takeUntil(this._unsubscibe))
              .subscribe((response1: APIResponse) => {
                if (response1.status === HttpStatusCode.Ok) {
                  e.imageRetrive = this._mediaService.getImgSrc(response1.data);
                  if (e.id == this.firstDuAnInfoPost.id) {
                    this.firstDuAnImageRetrive = e.imageRetrive;
                  }
                } else {
                  this._messageService.errorMessage(response1.data);
                }
              });
          })
          this.lstDuAnInfoPosts = response.data;
        } else {
         this._messageService.errorMessage(response.message); 
        }
      });

    this._noAuthService.getAllProvinces()
      .pipe(takeUntil(this._unsubscibe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.provinces = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
    this.initUserIdAndDeviceInfoValue();
    this._loadingService.loading(false);
  }

  getDistrictsInProvince(): void {
    this._noAuthService.getAllDistrictsInProvince(this.searchRequest.provinceCode)
      .pipe(takeUntil(this._unsubscibe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.districts = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getWardsInDistrict(): void {
    this.searchRequest.districtCode.forEach(e => {
      this._noAuthService.getAllWardsInDistrict(e)
        .pipe(takeUntil(this._unsubscibe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.wards = [...this.wards, ...response.data.filter((e: any) => e.code != "NOT_FOUND")];
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    })
  }

  viewInfoPost(id: number): void {
    this._router.navigate([`tien-ich/view/${id}`]);
  }

  setTinTucImg(id: number): void {
    this.lstInfoPosts.forEach((e: any) => {
      if (e.id == id) {
        this.firstImageRetrive = e.imageRetrive; 
        this.firstInfoPost = e;
      }
    });
  }

  setDuAnImg(id: number): void {
    this.lstDuAnInfoPosts.forEach((e: any) => {
      if (e.id == id) {
        this.firstDuAnImageRetrive = e.imageRetrive; 
        this.firstDuAnInfoPost = e;
      }
    });
  }

  navigateToInfoPostPage(): void {
    this._router.navigate(['tien-ich/tin-tuc']);
  }

  navigateToDuAnPage(): void {
    this._router.navigate(['tien-ich/du-an']);
  }

  navigateToMuaBanNhaDat(): void {
    this._router.navigate(['mua-ban/nha-dat']);
  }
  
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscibe.next(null);
    this._unsubscibe.complete();
  }

  renderSelectedDiaDiem(): string {
    if (this.searchRequest.provinceCode == null) {
      return "Địa điểm";
    } else {
      let str = "";
      this.provinces.forEach(e => {
        if (e.code == this.searchRequest.provinceCode) {
          str += e.name
        }
      })
      if (this.searchRequest.districtCode == null) {
        this.provinces.forEach(e => {
          if (e.code == this.searchRequest.provinceCode) {
            str += e.name;
          }
        });
      } else {
        str += " - ";
        this.districts.forEach(e => {
          this.searchRequest.districtCode.forEach(ee => {
            if (e.code == ee) {
              str += e.name + "; ";
            }
          })
        });
        str = str.substring(0, str.length - 2);
        if (this.searchRequest.wardCode != null) {
          str += " - "
          this.wards.forEach(e => {
            str +=  e.name + "; ";
          });
          str = str.substring(0, str.length - 3);
        }
      }
      return str.length > 30 ? str.substring(0, 30) + "..." : str;
    }
  }

  renderSelectedDienTich(): string {
    let post = " m2";
    if (this.searchRequest.startArea == null && this.searchRequest.endArea == null) {
      return "Diện tích" + post;
    } else if (this.searchRequest.startArea != null && this.searchRequest.endArea == null) {
      return ">= " + this.searchRequest.startArea + post; 
    } else if (this.searchRequest.startArea == null && this.searchRequest.endArea != null) {
      return "<= " + this.searchRequest.endArea + post; 
    } else {
      return ">= " + this.searchRequest.startArea + post + " và <= " + this.searchRequest.endArea + post;
    }
  }

  renderSelectedGia(): string {
    let post = "";
    if (this.searchRequest.sell == 1) {
      post = " tỷ VNĐ";
    } else {
      post = " triệu VNĐ";
    }
    let str = "";
    if (this.searchRequest.startPrice == null && this.searchRequest.endPrice == null) {
      str = "Khoảng giá: (" + post + " )";
    } else if (this.searchRequest.startPrice != null && this.searchRequest.endPrice == null) {
      str = ">= " + this.searchRequest.startPrice + post; 
    } else if (this.searchRequest.startPrice == null && this.searchRequest.endPrice != null) {
      str = "<= " + this.searchRequest.endPrice + post; 
    } else {
      str = ">= " + this.searchRequest.startPrice + post + " và <= " + this.searchRequest.endPrice + post;
    }
    return str.length > 30 ? str.substring(0, 30) + "..." : str;
  }

  renderSelectedXemThem(): string {
    let strPn = "PN: " + this.searchRequest.noOfBedrooms.join(", ");
    let strDir = "Hướng: " + this.searchRequest.direction.join(", ");
    let res = "";
    if(strPn == "PN: " && strDir == "Hướng: ") {
      res = "Chọn thêm";
    } else if (strPn != "PN: " && strDir == "Hướng: ") {
      res = strPn;
    } else if (strPn == "PN: " && strDir != "Hướng: ") {
      res = strDir;
    } else {
      res = strPn + " - " + strDir;
    }
    return res.length > 30 ? res.substring(0, 30) + "..." : res;
    // if (this.searchRequest.noOfBedrooms != null && this.searchRequest.direction != null) {
    //   let direction = "";
    //   this.lstDirections.forEach(e => {
    //     if (e.key == this.searchRequest.direction) {
    //       direction = e.value;
    //     }
    //   })
    //   return this.searchRequest.noOfBedrooms + " PN và Hướng: " + direction;
    // } else if (this.searchRequest.noOfBedrooms == null && this.searchRequest.direction != null) {
    //   let direction = "";
    //   this.lstDirections.forEach(e => {
    //     if (e.key == this.searchRequest.direction) {
    //       direction = e.value;
    //     }
    //   })
    //   return "Hướng: " + direction;
    // } else if (this.searchRequest.noOfBedrooms != null && this.searchRequest.direction == null) {
    //   return this.searchRequest.noOfBedrooms + " PN";
    // } else {
    //   return "Chọn thêm";
    // }
  }

  onSelectBedroom(value: number): void {
    if (this.searchRequest.noOfBedrooms.includes(value)) {
      const index = this.searchRequest.noOfBedrooms.indexOf(value);
      if (index > -1) { 
        this.searchRequest.noOfBedrooms.splice(index, 1);
      }
    } else {
      this.searchRequest.noOfBedrooms.push(value);
    }
  }

  onSearch(): void {
    // console.log(this.searchRequest);
    this._loadingService.loading(true);
    this._realEstatePostService.setSearchBody(this.searchRequest);
    setTimeout(() => {
      this._loadingService.loading(false)
      this._router.navigate(['tim-kiem']);
    }, 500);
  }
}
