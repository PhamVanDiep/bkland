import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CAROUSEL_TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-info-post-carousel',
  templateUrl: './info-post-carousel.component.html',
  styleUrls: ['./info-post-carousel.component.css']
})
export class InfoPostCarouselComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  @Input() type: string;
  @Input() items: number;

  infoPosts: any[];

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
    private _infoPostService: InfoPostService,
    private _mediaService: MediaService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  viewDetail(id: any): void {
    if (this.type == CAROUSEL_TYPE.DU_AN) {
      this._router.navigate([`tien-ich/du-an/detail/${id}`]);
    } if (this.type == CAROUSEL_TYPE.TIN_TUC) {
      this._router.navigate([`tien-ich/tin-tuc/detail/${id}`]);
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.type == CAROUSEL_TYPE.TIN_TUC) {
      this._infoPostService.getHomePagePosts()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.infoPosts = response.data;
            response.data.forEach((e: any) => {
              this._mediaService.retriveImage(e.imageUrl)
                .pipe(takeUntil(this._unsubscribe))
                .subscribe((response1: APIResponse) => {
                  if (response1.status === HttpStatusCode.Ok) {
                    e.imageRetrive = this._mediaService.getImgSrc(response1.data);
                  } else {
                    this._messageService.errorMessage(response1.message);
                  }
                })
            })
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else if (this.type == CAROUSEL_TYPE.DU_AN) {
      this._infoPostService.getHomePageDuAnPosts()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.infoPosts = response.data;
            response.data.forEach((e: any) => {
              this._mediaService.retriveImage(e.imageUrl)
                .pipe(takeUntil(this._unsubscribe))
                .subscribe((response1: APIResponse) => {
                  if (response1.status === HttpStatusCode.Ok) {
                    e.imageRetrive = this._mediaService.getImgSrc(response1.data);
                  } else {
                    this._messageService.errorMessage(response1.message);
                  }
                })
            })
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }
}
