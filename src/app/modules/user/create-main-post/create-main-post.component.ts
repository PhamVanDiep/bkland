import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { DIRECTION, DIRECTION_DROPDOWN } from 'src/app/core/constants/direction.constant';
import { PERIOD_DROPDOWN } from 'src/app/core/constants/period.constant';
import { PRIORITY_DROPDOWN } from 'src/app/core/constants/priority.constant';
import { ROLE } from 'src/app/core/constants/role.constant';
import { STATUS } from 'src/app/core/constants/status.constant';
import { POST_TYPE, TYPE, TYPE_DROPDOWN } from 'src/app/core/constants/type.constant';
import { Apartment } from 'src/app/core/models/apartment.model';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { District } from 'src/app/core/models/district.model';
import { House } from 'src/app/core/models/house.model';
import { Plot } from 'src/app/core/models/plot.model';
import { PostMedia } from 'src/app/core/models/post-media.model';
import { Province } from 'src/app/core/models/province.model';
import { RealEstatePost, RealEstatePostRequest } from 'src/app/core/models/real-estate-post.model';
import { Ward } from 'src/app/core/models/ward.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { SpecialAccountService } from 'src/app/core/services/special-account.service';
import { UserService } from 'src/app/core/services/user.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-create-main-post',
  templateUrl: './create-main-post.component.html',
  styleUrls: ['./create-main-post.component.css']
})
export class CreateMainPostComponent implements OnInit, OnDestroy {

  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Bài đăng bán/cho thuê';

  realEstatePost: RealEstatePost;
  plot: Plot;
  apartment: Apartment;
  house: House;
  realEstateTypes: any;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  directions: any;
  priorities: any[];
  periods: any[];
  payValue: number;
  selectedFiles: any[];
  images: PostMedia[];
  selectedFileNames: string[];
  isUpdate: boolean;
  isAgency: boolean;
  lstSelectedDistrictCodes: string[];

  constructor(
    private _appTitleService: AppTitleService,
    private _noAuthService: NoAuthService,
    private _messageService: MessageService,
    public _loadingService: LoadingService,
    private _mediaService: MediaService,
    private _realEstatePostService: RealEstatePostService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _specialAccountService: SpecialAccountService
  ) {
    this._appTitleService.setTitle(this.title);
    this.realEstateTypes = TYPE_DROPDOWN;
    this.directions = DIRECTION_DROPDOWN;
    this.priorities = [];
    this.priorities.concat(PRIORITY_DROPDOWN);
    this.periods = [];
    this.periods.concat(PERIOD_DROPDOWN);
    this.payValue = 0;
    this.selectedFiles = [];
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
        administrativeUnitId: 7,
        codeName: '',
        fullName: '',
        fullNameEn: '',
        name: '',
        nameEn: '',
        provinceCode: ''
      },
      enable: true,
      id: '',
      lat: 0.0,
      lng: 0.0,
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
      street: '',
      view: 0,
      clickedView: 0
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
      realEstatePost: this.realEstatePost
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
    this.selectedFileNames = [];
    if (this._router.url === '/user/create-post') {
      this.isUpdate = false;
    } else {
      this.isUpdate = true;
    }
    this.isAgency = this._userService.isAgency();
    this.lstSelectedDistrictCodes = [];
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((response: any) => {
        this.realEstatePost.lat = response.coords.latitude;
        this.realEstatePost.lng = response.coords.longitude;
      });
    }
    
    this._noAuthService.getAllProvinces()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.provinces = response.data.filter((e: any) => e.code != "NOT_FOUND");
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    if (this.isUpdate) {
      let postId = this._route.snapshot.paramMap.get('id') || '';
      this._realEstatePostService.getPostById(postId)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            let postMediaDTOS = response.data.postMediaDTOS;
            postMediaDTOS.forEach((e: any) => {
              this.selectedFileNames.push(e.name);
            });
            let basePost = response.data.basePost;
            this.realEstatePost = basePost.realEstatePost;
            if (this.realEstatePost.type === TYPE.APARTMENT) {
              this.apartment.id = basePost.id;
              this.apartment.balconyDirection = basePost.balconyDirection;
              this.apartment.construction = basePost.construction;
              this.apartment.floorNo = basePost.floorNo;
              this.apartment.furniture = basePost.furniture;
              this.apartment.noBathroom = basePost.noBathroom;
              this.apartment.noBedroom = basePost.noBedroom;
              this.apartment.realEstatePost = basePost.realEstatePost;
            } else if (this.realEstatePost.type === TYPE.HOUSE) {
              this.house.balconyDirection = basePost.balconyDirection;
              this.house.behindWidth = basePost.behindWidth;
              this.house.frontWidth = basePost.frontWidth;
              this.house.furniture = basePost.furniture;
              this.house.id = basePost.id;
              this.house.noBathroom = basePost.noBathroom;
              this.house.noBedroom = basePost.noBedroom;
              this.house.noFloor = basePost.noFloor;
              this.house.streetWidth = basePost.streetWidth;
              this.house.realEstatePost = basePost.realEstatePost;
            } else if (this.realEstatePost.type === TYPE.PLOT) {
              this.plot.id = basePost.id;
              this.plot.behindWidth = basePost.behindWidth;
              this.plot.frontWidth = basePost.frontWidth;
              this.plot.realEstatePost = basePost.realEstatePost;
            }
            this.getDistrictsInProvince();
            this.getWardsInDistrict();
            this.calcPayVal();
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      if (this.isAgency) {
        this._specialAccountService.agencyInfo(this.realEstatePost.ownerId.id)
          .pipe(takeUntil(this._unsubscribe))
          .subscribe((response: APIResponse) => {
            if (response.status === HttpStatusCode.Ok) {
              response.data.districts.forEach((e: any) => {
                this.lstSelectedDistrictCodes.push(e.code);
              })
            } else {
              this._messageService.errorMessage(response.message);
            }
          }) 
      }
    }
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
          this._messageService.errorMessage(response.message);
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
          this._messageService.errorMessage(response.message);
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
    this.payValue = price * heSo;
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles == null || this.selectedFiles == undefined) {
      return;
    }

    if (this.selectedFiles.length < 2) {
      this._messageService.warningMessage('Cần chọn tối thiểu 2 ảnh.');
      this.selectedFiles = [];
      return;
    }
    if (this.selectedFiles.length > 6) {
      this._messageService.warningMessage('Chỉ được chọn tối đa 6 ảnh');
      this.selectedFiles = [];
      return;
    }

    this.selectedFileNames = [];
    for (let index = 0; index < this.selectedFiles.length; index++) {
      const element = this.selectedFiles[index];
      if (Math.round(element.size/1048576) > 16) {
        this.selectedFiles = [];
        this.selectedFileNames = [];
        return;
      }
      this.selectedFileNames.push(element.name);
    }
  }

  removeImage(name: string): void {
    // this.selectedFileNames.
  }

  checkPriorityAndPeriod(): boolean {
    if (this.isAgency && this.lstSelectedDistrictCodes.includes(this.realEstatePost.district.code)) {
      let _priorities: any[] = [];
      _priorities.concat(this.priorities);
      _priorities.push({
        key: 4,
        value: 'Mức 4',
        priceHire: 0,
        priceSell: 0
      })
      this.priorities = _priorities;
      this.realEstatePost.priority = 4;

      let _periods: any[] = [];
      _periods.concat(this.periods);
      _periods.push({
        key: 365,
        value: '365 ngày',
        heSo: 0
      });
      this.periods = _periods;

      return true;
    } else {
      this.priorities = PRIORITY_DROPDOWN;
      this.periods = PERIOD_DROPDOWN;
      this.realEstatePost.period = 15;
      this.realEstatePost.priority = 1;

      return false;
    }
  }

  check(): boolean {
    if (this.isAgency && this.lstSelectedDistrictCodes.includes(this.realEstatePost.district.code)) {
      return true;
    }
    return false;
  }

  async savePost() {
    if (this.selectedFiles.length > 0) {
      if (this.selectedFiles.length < 2) {
        this._messageService.warningMessage('Cần chọn tối thiểu 2 ảnh.');
        this.selectedFiles = [];
        return;
      }
      if (this.selectedFiles.length > 6) {
        this._messageService.warningMessage('Chỉ được chọn tối đa 6 ảnh');
        this.selectedFiles = [];
        return;
      }
    }
    if (!this.isUpdate) {
      if (this.selectedFiles == undefined || this.selectedFiles == null || this.selectedFiles.length == 0) {
        this._messageService.errorMessage('Bạn chưa chọn ảnh');
        return;
      }
      this._loadingService.loading(true);
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
          postType: POST_TYPE.REAL_ESTATE_POST,
          name: element.name
        }
        this.images.push(img);
      }

      let realEstatePostRequest: RealEstatePostRequest = {
        apartment: this.apartment,
        house: this.house,
        images: this.images,
        plot: this.plot,
        realEstatePost: this.realEstatePost
      }
      let postResponse = await firstValueFrom(this._realEstatePostService.createPost(realEstatePostRequest).pipe(takeUntil(this._unsubscribe)));
      this._loadingService.loading(false);
      if (postResponse.status === HttpStatusCode.Ok) {
        this._messageService.successMessage(postResponse.message);
        this._router.navigate(['user/post/main']);
      } else {
        this._messageService.errorMessage(postResponse.message);
      }
    } else {
      this._loadingService.loading(true);
      this.images = [];

      if (this.selectedFiles.length > 0) {
        let deleteImagesResponse = await firstValueFrom(this._mediaService.deletePhotoByPostId(this.realEstatePost.id));
        if (deleteImagesResponse.status === HttpStatusCode.Ok) {
          
        } else {
          this._messageService.errorMessage(deleteImagesResponse.message);
          return;
        }
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
            postType: POST_TYPE.REAL_ESTATE_POST,
            name: element.name
          }
          this.images.push(img);
        } 
      }
      this.realEstatePost.updateBy = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
      let realEstatePostRequest: RealEstatePostRequest = {
        apartment: this.apartment,
        house: this.house,
        images: this.images,
        plot: this.plot,
        realEstatePost: this.realEstatePost
      }
      let postResponse = await firstValueFrom(this._realEstatePostService.updatePost(realEstatePostRequest).pipe(takeUntil(this._unsubscribe)));
      this._loadingService.loading(false);
      if (postResponse.status === HttpStatusCode.Ok) {
        this._messageService.successMessage(postResponse.message);
        this._router.navigate(['user/post/main']);
      } else {
        this._messageService.successMessage(postResponse.message);
      }
    }
  }
}
