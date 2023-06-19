import { DatePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { DIRECTION, DIRECTION_DROPDOWN } from 'src/app/core/constants/direction.constant';
import { PRIORITY_DROPDOWN } from 'src/app/core/constants/priority.constant';
import { TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';

@Component({
  selector: 'app-rep-detail',
  templateUrl: './rep-detail.component.html',
  styleUrls: ['./rep-detail.component.css'],
  providers: [
    DatePipe
  ]
})
export class RepDetailComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  @Input() postId: string;
  @Input() increaseView: boolean;

  realEstatePost: any;
  images: any[];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  displayBasic: boolean;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  center: google.maps.LatLngLiteral;
  zoom: any;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  position: google.maps.LatLngLiteral;
  priceFluctuations: any[];

  displayCreateReportDialog: boolean;
  displayComment: boolean;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _realEstatePostService: RealEstatePostService,
    private _mediaService: MediaService,
    private _datePipe: DatePipe
  ) {
    this.images = [];
    this.displayBasic = false;
    this.innerWidth = window.innerWidth;
    this.zoom = 18;
    this.priceFluctuations = [];
    this.displayCreateReportDialog = false;
    this.displayComment = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    if (this.postId != undefined && this.postId != null) {
      this._loadingService.loading(true);
      if (this.increaseView) {
        this._realEstatePostService.findByIdWithIncreaseView(this.postId)
          .pipe(takeUntil(this._unsubscribe))
          .subscribe((response: APIResponse) => {
            this._loadingService.loading(false);
            if (response.status === HttpStatusCode.Ok) {
              this.realEstatePost = response.data;
              this.setLstImages(response.data?.postMediaDTOS);
              this.center = {
                lat: this.realEstatePost?.basePost.realEstatePost.lat,
                lng: this.realEstatePost?.basePost.realEstatePost.lng
              };
              this.position = {
                lat: this.realEstatePost?.basePost.realEstatePost.lat,
                lng: this.realEstatePost?.basePost.realEstatePost.lng
              };
              this.priceFluctuations = this.realEstatePost?.basePost.realEstatePost.realEstatePostPrices;
            } else {
              this._messageService.errorMessage(response.message);
            }
          })
      } else {
        this._realEstatePostService.getPostById(this.postId)
          .pipe(takeUntil(this._unsubscribe))
          .subscribe((response: APIResponse) => {
            this._loadingService.loading(false);
            if (response.status === HttpStatusCode.Ok) {
              this.realEstatePost = response.data;
              this.setLstImages(response.data?.postMediaDTOS);
              this.center = {
                lat: this.realEstatePost?.basePost.realEstatePost.lat,
                lng: this.realEstatePost?.basePost.realEstatePost.lng
              };
              this.position = {
                lat: this.realEstatePost?.basePost.realEstatePost.lat,
                lng: this.realEstatePost?.basePost.realEstatePost.lng
              };
              this.priceFluctuations = this.realEstatePost?.basePost.realEstatePost.realEstatePostPrices;
            } else {
              this._messageService.errorMessage(response.message);
            }
          })
      }
    }
  }

  async setLstImages(postMedias: any[]) {
    for (let index = 0; index < postMedias.length; index++) {
      const element = postMedias[index];
      await firstValueFrom(this._mediaService.getImage(element.id).pipe(takeUntil(this._unsubscribe)))
        .then((response: APIResponse) => {
          this.images.push(this._mediaService.getImgSrc(response.data));
        });
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  isPlot(): boolean {
    if (this.realEstatePost?.basePost.realEstatePost.type === TYPE.PLOT) {
      return true;
    }
    return false;
  }

  isApartment(): boolean {
    if (this.realEstatePost?.basePost.realEstatePost.type === TYPE.APARTMENT) {
      return true;
    }
    return false;
  }

  isHouse(): boolean {
    if (this.realEstatePost?.basePost.realEstatePost.type === TYPE.HOUSE) {
      return true;
    }
    return false;
  }

  floorNoOrNoFloor(): string {
    if (this.isApartment()) {
      return 'Tầng ' + this.realEstatePost?.basePost.floorNo;
    }
    return this.realEstatePost?.basePost.noFloor + ' tầng';
  }

  calculatePricePerM2(): string {
    let price = this.realEstatePost?.basePost.realEstatePost.price;
    let sell = this.realEstatePost?.basePost.realEstatePost.sell;
    let area = this.realEstatePost?.basePost.realEstatePost.area;
    return '~ ' + (price / area).toFixed(2) + ' ' + (sell ? 'tỷ VNĐ/m2' : 'triệu VNĐ/m2');
  }

  getRepDirection(): string {
    let directions = DIRECTION_DROPDOWN;
    let repDirection = this.realEstatePost?.basePost.realEstatePost.direction;
    let response = '';
    directions.forEach(e => {
      if (e.key === repDirection) {
        response = e.value;
      }
    });
    return response;
  }

  getBalconyDirection(): string {
    let directions = DIRECTION_DROPDOWN;
    let repDirection = this.realEstatePost?.basePost.balconyDirection;
    let response = '';
    directions.forEach(e => {
      if (e.key === repDirection) {
        response = e.value;
      }
    });
    return response;
  }

  getPriority(): string {
    let priority = this.realEstatePost?.basePost.realEstatePost.priority;
    let priorities = PRIORITY_DROPDOWN;
    let response = '';
    priorities.forEach(e => {
      if (e.key === priority) {
        response = e.value;
      }
    });
    return response;
  }

  getExpireDate(): string {
    if (this.realEstatePost?.basePost.realEstatePost.createAt == undefined || this.realEstatePost?.basePost.realEstatePost.createAt == null) {
      return '';
    }
    let date = new Date(this.realEstatePost?.basePost.realEstatePost.createAt);
    date.setDate(date.getDate() + this.realEstatePost?.basePost.realEstatePost.period);
    return this._datePipe.transform(date, "dd/MM/yyyy hh:mm:ss a")?.toString() || '';
  }

  report(): void {
    this.displayCreateReportDialog = true;
  }

  comment(): void {
    this.displayComment = true;
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
