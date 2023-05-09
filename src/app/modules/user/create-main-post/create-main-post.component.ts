import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { DIRECTION } from 'src/app/core/constants/direction.constant';
import { STATUS } from 'src/app/core/constants/status.constant';
import { TYPE } from 'src/app/core/constants/type.constant';
import { Apartment } from 'src/app/core/models/apartment.model';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { District } from 'src/app/core/models/district.model';
import { House } from 'src/app/core/models/house.model';
import { Plot } from 'src/app/core/models/plot.model';
import { Province } from 'src/app/core/models/province.model';
import { RealEstatePost } from 'src/app/core/models/real-estate-post.model';
import { Ward } from 'src/app/core/models/ward.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';

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

  constructor(
    private _noAuthService: NoAuthService,
    private _messageService: MessageService,
    private _loadingService: LoadingService
  ) {
    this.realEstateTypes = [
      {
        key: TYPE.HOUSE,
        value: 'Nhà đất'
      },
      {
        key: TYPE.APARTMENT,
        value: 'Chung cư'
      },
      {
        key: TYPE.PLOT,
        value: 'Đất nền'
      }
    ];
    this.directions = [
      {
        key: DIRECTION.DONG,
        value: 'Đông'
      },
      {
        key: DIRECTION.TAY,
        value: 'Tây'
      },
      {
        key: DIRECTION.NAM,
        value: 'Nam'
      },
      {
        key: DIRECTION.BAC,
        value: 'Bắc'
      },
      {
        key: DIRECTION.DONG_NAM,
        value: 'Đông Nam'
      },
      {
        key: DIRECTION.TAY_NAM,
        value: 'Tây Nam'
      },
      {
        key: DIRECTION.DONG_BAC,
        value: 'Đông Bắc'
      },
      {
        key: DIRECTION.TAY_BAC,
        value: 'Tây Bắc'
      },
    ]
    this.realEstatePost = {
      addressShow: '',
      area: 0,
      createAt: null,
      updateAt: null,
      createBy: '',
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
        id: '',
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
      balconyDirection: '',
      construction: '',
      furniture: '',
      noBathroom: 0,
      noBedroom: 0,
      realEsatatePost: this.realEstatePost
    }
    this.house = {
      id: 0,
      balconyDirection: '',
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
}
