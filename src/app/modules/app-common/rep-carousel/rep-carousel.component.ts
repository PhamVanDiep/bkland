import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CAROUSEL_TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';

@Component({
  selector: 'app-rep-carousel',
  templateUrl: './rep-carousel.component.html',
  styleUrls: ['./rep-carousel.component.css']
})
export class RepCarouselComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  @Input() type: string;

  reps: any[];
  deviceInfo: DeviceInfo;
  noInterest: number;
  userId: string;
  deviceInfoStr: string;
  isAuthenticated: boolean;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _realEstatePostService: RealEstatePostService,
    private _mediaService: MediaService,
    private _authService: AuthService,
    private _deviceDetectorService: DeviceDetectorService,
    private _router: Router
  ) {
    this.reps = [];
    this.noInterest = 0;
    this.deviceInfoStr = '';
    if (this._authService.isAuthenticated()) {
      this.isAuthenticated = true;
      this.userId = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    } else {
      this.isAuthenticated = false;
      this.userId = '';
    }
    this.innerWidth = window.innerWidth;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    if (this.type == CAROUSEL_TYPE.BEST_INTERESTED) {
      this._realEstatePostService.getPostsByMostInterested()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.reps = response.data;
            this.reps.forEach(e => {
              if (e.imageUrl != undefined && e.imageUrl != null && e.imageUrl.length > 0) {
                this._mediaService.getImage(e.imageUrl)
                  .pipe(takeUntil(this._unsubscribe))
                  .subscribe((response1: APIResponse) => {
                    if (response1.status === HttpStatusCode.Ok) {
                      e.imageRetrive = this._mediaService.getImgSrc(response1.data);
                    } else {
                      this._messageService.errorMessage(response1.message);
                    }
                  }) 
              }
              this._realEstatePostService.isInterested(this.userId, e.id, this.isAuthenticated ? '' : this.deviceInfo.userAgent.replaceAll(' ', ''))
                .pipe(takeUntil(this._unsubscribe))
                .subscribe((response2: APIResponse) => {
                  if (response2.status === HttpStatusCode.Ok) {
                    e.interested = response2.data;
                  } else {
                    this._messageService.errorMessage(response2.message);
                  }
                });
            })
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else if (this.type === CAROUSEL_TYPE.BEST_VIEW) {
      this._realEstatePostService.getPostsByMostView()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.reps = response.data;
            this.reps.forEach(e => {
              if (e.imageUrl != undefined && e.imageUrl != null && e.imageUrl.length > 0) {
                this._mediaService.getImage(e.imageUrl)
                  .pipe(takeUntil(this._unsubscribe))
                  .subscribe((response1: APIResponse) => {
                    if (response1.status === HttpStatusCode.Ok) {
                      e.imageRetrive = this._mediaService.getImgSrc(response1.data);
                    } else {
                      this._messageService.errorMessage(response1.message);
                    }
                  }) 
              }
            })
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else if (this.type === CAROUSEL_TYPE.NEWEST) {
      this._realEstatePostService.getPostsByNewest()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.reps = response.data;
            this.reps.forEach(e => {
              if (e.imageUrl != undefined && e.imageUrl != null && e.imageUrl.length > 0) {
                this._mediaService.getImage(e.imageUrl)
                  .pipe(takeUntil(this._unsubscribe))
                  .subscribe((response1: APIResponse) => {
                    if (response1.status === HttpStatusCode.Ok) {
                      e.imageRetrive = this._mediaService.getImgSrc(response1.data);
                    } else {
                      this._messageService.errorMessage(response1.message);
                    }
                  }) 
              }
            })
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._realEstatePostService.interestPosts$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: number) => {
        this.noInterest = response;
      });
    
    this.deviceInfo = this._deviceDetectorService.getDeviceInfo();
  }

  onInterest(rep: any): void {
    if (this._authService.isAuthenticated()) {
      this._realEstatePostService.userInterested({
        realEstatePostId: rep?.id
      }).pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            if (response.message === "DELETED") {
              rep.interested = false;
              this.noInterest--;
              this._realEstatePostService.setInterestPosts(this.noInterest);
            } else {
              rep.interested = true;
              this.noInterest++;
              this._realEstatePostService.setInterestPosts(this.noInterest);
            }
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this._realEstatePostService.anonymousInterested({
        realEstatePostId: rep?.id,
        deviceInfo: this.deviceInfo.userAgent.replaceAll(' ', '')
      }).pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            if (response.message === "DELETED") {
              rep.interested = false;
              this.noInterest--;
              this._realEstatePostService.setInterestPosts(this.noInterest);
            } else {
              rep.interested = true;
              this.noInterest++;
              this._realEstatePostService.setInterestPosts(this.noInterest);
            }
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  viewDetail(id: string): void {
    this._router.navigate([`home/${id}`]);
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
