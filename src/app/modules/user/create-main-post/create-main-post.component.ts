import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { response } from 'express';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { DIRECTION, DIRECTION_DROPDOWN } from 'src/app/core/constants/direction.constant';
import { PERIOD_DROPDOWN } from 'src/app/core/constants/period.constant';
import { PRIORITY_DROPDOWN } from 'src/app/core/constants/priority.constant';
import { STATUS } from 'src/app/core/constants/status.constant';
import { TYPE, TYPE_DROPDOWN } from 'src/app/core/constants/type.constant';
import { Apartment } from 'src/app/core/models/apartment.model';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { District } from 'src/app/core/models/district.model';
import { House } from 'src/app/core/models/house.model';
import { Plot } from 'src/app/core/models/plot.model';
import { PostMedia } from 'src/app/core/models/post-media.model';
import { Province } from 'src/app/core/models/province.model';
import { RealEstatePost, RealEstatePostRequest } from 'src/app/core/models/real-estate-post.model';
import { Ward } from 'src/app/core/models/ward.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-create-main-post',
  templateUrl: './create-main-post.component.html',
  styleUrls: ['./create-main-post.component.css']
})
export class CreateMainPostComponent implements OnInit, OnDestroy {

  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  realEstatePost: RealEstatePost;
  plot: Plot;
  apartment: Apartment;
  house: House;
  realEstateTypes: any;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  directions: any;
  priorities: any;
  periods: any;
  payValue: number;
  selectedFiles: any;
  images: PostMedia[];

  constructor(
    private _noAuthService: NoAuthService,
    private _messageService: MessageService,
    public _loadingService: LoadingService,
    private _mediaService: MediaService,
    private _realEstatePostService: RealEstatePostService
  ) {
    this.realEstateTypes = TYPE_DROPDOWN;
    this.directions = DIRECTION_DROPDOWN;
    this.priorities = PRIORITY_DROPDOWN;
    this.periods = PERIOD_DROPDOWN;
    this.payValue = 0;
    this.selectedFiles = null;
    let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    this.realEstatePost = {
      addressShow: '',
      area: 0,
      createAt: null,
      updateAt: null,
      createBy: _id,
      updateBy: '',
      description: '',
      direction: '',
      district: {
        code: '',
        administrativeUnitId: '',
        codeName: '',
        fullName: '',
        fullNameEn: '',
        name: '',
        nameEn: '',
        provinceCode: ''
      },
      enable: true,
      id: '',
      lat: 0,
      lng: 0,
      ownerId: {
        id: _id,
        accountBalance: 0,
        address: "",
        avatarUrl: "",
        dateOfBirth: "",
        districtCode: "",
        email: "",
        enable: true,
        firstName: "",
        gender: "MALE",
        identification: "",
        lastName: "",
        middleName: "",
        password: "",
        phoneNumber: "",
        provinceCode: "",
        roles: null,
        username: "",
        wardCode: "",
        createBy: '',
        createAt: null,
        updateBy: '',
        updateAt: null
      },
      period: 0,
      price: 0,
      priority: 0,
      province: {
        administrativeRegion: '',
        administrativeUnit: '',
        code: '',
        codeName: '',
        fullName: '',
        fullNameEn: '',
        name: '',
        nameEn: ''
      },
      sell: true,
      status: STATUS.CHO_KIEM_DUYET,
      title: '',
      type: TYPE.APARTMENT,
      ward: {
        administrativeUnitId: '',
        code: '',
        codeName: '',
        districtCode: '',
        fullName: '',
        fullNameEn: '',
        name: '',
        nameEn: ''
      },
      street: ''
    };
    this.plot = {
      behindWidth: 0,
      frontWidth: 0,
      id: 0,
      realEstatePost: this.realEstatePost
    };
    this.apartment = {
      id: 0,
      floorNo: 0,
      balconyDirection: DIRECTION.DONG,
      construction: '',
      furniture: '',
      noBathroom: 0,
      noBedroom: 0,
      realEsatatePost: this.realEstatePost
    }
    this.house = {
      id: 0,
      balconyDirection: DIRECTION.DONG,
      behindWidth: 0,
      frontWidth: 0,
      furniture: '',
      noBathroom: 0,
      noBedroom: 0,
      noFloor: 0,
      realEstatePost: this.realEstatePost,
      streetWidth: 0
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this._noAuthService.getAllProvinces()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.provinces = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      });
  }

  nullable(field: string): boolean {
    if (field.length > 0) {
      return false;
    }
    return true;
  }

  getDistrictsInProvince(): void {
    this._noAuthService.getAllDistrictsInProvince(this.realEstatePost.province.code)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.districts = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }

  getWardsInDistrict(): void {
    this._noAuthService.getAllWardsInDistrict(this.realEstatePost.district.code)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.wards = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: response.message });
        }
      })
  }

  isPlot(): boolean {
    if (this.realEstatePost.type === TYPE.PLOT) {
      return true;
    }
    return false;
  }

  isApartment(): boolean {
    if (this.realEstatePost.type === TYPE.APARTMENT) {
      return true;
    }
    return false;
  }

  isHouse(): boolean {
    if (this.realEstatePost.type === TYPE.HOUSE) {
      return true;
    }
    return false;
  }

  changeIsSell(sell: boolean): void {
    this.realEstatePost.sell = sell;
    this.calcPayVal();
  }

  calcPayVal(): void {
    let price = 0;
    let heSo = 0;
    this.priorities.forEach((e: any) => {
      if (e.key === this.realEstatePost.priority) {
        if (this.realEstatePost.sell) {
          price = e.priceSell;
        } else {
          price = e.priceHire;
        }
      }
    });
    this.periods.forEach((e: any) => {
      if (this.realEstatePost.period === e.key) {
        heSo = e.heSo;
      }
    });
    this.payValue = price*heSo;
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
  }

  async createPost() {
    if (this.selectedFiles == undefined || this.selectedFiles == null || this.selectedFiles.length == 0) {
      this._messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Bạn chưa chọn ảnh' });
      return;
    }
    // this._loadingService.loading(true);
    this.realEstatePost.id = this.realEstatePost.type.toLowerCase() + '-' + uuid.v4();
    this.images = [];
    for (let index = 0; index < this.selectedFiles.length; index++) {
      const element = this.selectedFiles[index];
      let formData = new FormData();
      formData.append('title', element.type);
      formData.append('image', element, element.name);
      let response = await firstValueFrom(this._mediaService.postImage(formData).pipe(takeUntil(this._unsubscribe)));
      let img: PostMedia = {
        id: response.data,
        mediaType: element.type,
        postId: this.realEstatePost.id,
        postType: 'REAL_ESTATE_POST'
      }
      this.images.push(img);
      // this._mediaService.postImage(formData)
      //   .pipe(takeUntil(this._unsubscribe))
      //   .subscribe((response: APIResponse) => {
      //     // console.log(response);
      //     let img: PostMedia = {
      //       id: response.data,
      //       mediaType: element.type,
      //       postId: this.realEstatePost.id,
      //       postType: 'REAL_ESTATE_POST'
      //     }
      //     this.images.push(img);
      //   });
    }
    let realEstatePostRequest: RealEstatePostRequest = {
      apartment: this.apartment,
      house: this.house,
      images: this.images,
      plot: this.plot,
      realEstatePost: this.realEstatePost
    }
    this._realEstatePostService.createPost(realEstatePostRequest)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        console.log(response);
      })
    this._loadingService.loading(false);
  }
}
