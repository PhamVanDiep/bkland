import { HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.css']
})
export class ClientViewComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  @Input() rep: any;
  @Input() sell: boolean;
  @Output() onView: EventEmitter<any> = new EventEmitter<any>();

  showPhoneNumber: boolean;
  noInterest: number;
  deviceInfo: DeviceInfo;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _mediaService: MediaService,
    private _realEstatePostService: RealEstatePostService,
    private _clipboardService: ClipboardService,
    private _authService: AuthService,
    private _deviceDetectorService: DeviceDetectorService
  ) {
    this.showPhoneNumber = false;
    this.noInterest = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    this.retriveImage(this.rep?.imageUrl)
    this.retriveAvatar(this.rep?.avatarUrl);
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

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  async retriveAvatar(path: string) {
    if (path == undefined || path == null || path.length == 0) {
      this.rep.avatarRetrive = '/assets/images/user.png'
    } else if (path.includes(environment.BASE_URL_NO_AUTH)) {
      await firstValueFrom(this._mediaService.retriveImage(path).pipe(takeUntil(this._unsubscribe)))
        .then((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.rep.avatarRetrive = this._mediaService.getImgSrc(response.data)
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this.rep.avatarRetrive = path;
    }
  }

  retriveImage(imgId: string): void {
    if (imgId == undefined || imgId == null || imgId.length <= 0) {
      return;
    }
    this._mediaService.retriveImage(`${environment.BASE_URL_NO_AUTH}/photos/${imgId}`)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.rep.imageRetrive = this._mediaService.getImgSrc(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      });
  }

  viewDetail(): void {
    this.onView.next(this.rep?.id);
  }

  showPhoneNumberFunc(): void {
    if (!this.showPhoneNumber) {
      this._realEstatePostService.clickUserDetail({
        postId: this.rep?.id
      }).subscribe();
      this.showPhoneNumber = true;
    }
  }

  copyFunc(): void {
    let phoneNumber = this.showPhoneNumber ? this.rep?.phoneNumber : (this.rep?.phoneNumber.substr(0, 7) + "***");
    this._clipboardService.copyFromContent(phoneNumber);
  }

  onInterest(): void {
    if (this._authService.isAuthenticated()) {
      this._realEstatePostService.userInterested({
        realEstatePostId: this.rep?.id
      }).pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            if (response.message === "DELETED") {
              this.rep.interested = false;
              this.noInterest--;
              this._realEstatePostService.setInterestPosts(this.noInterest);
            } else {
              this.rep.interested = true;
              this.noInterest++;
              this._realEstatePostService.setInterestPosts(this.noInterest);
            }
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      this._realEstatePostService.anonymousInterested({
        realEstatePostId: this.rep?.id,
        deviceInfo: this.deviceInfo.userAgent.replaceAll(' ', '')
      }).pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            if (response.message === "DELETED") {
              this.rep.interested = false;
              this.noInterest--;
              this._realEstatePostService.setInterestPosts(this.noInterest);
            } else {
              this.rep.interested = true;
              this.noInterest++;
              this._realEstatePostService.setInterestPosts(this.noInterest);
            }
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }
}
