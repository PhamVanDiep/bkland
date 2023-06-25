import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CAROUSEL_TYPE } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy{

  private _unsubscibe: ReplaySubject<any> = new ReplaySubject<any>();

  firstImageRetrive: any;
  firstInfoPost: any;
  lstInfoPosts: any[];

  firstDuAnImageRetrive: any;
  firstDuAnInfoPost: any;
  lstDuAnInfoPosts: any[];

  mostViewType: string;
  mostInterestedType: string;
  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _infoPostService: InfoPostService,
    private _mediaService: MediaService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.lstInfoPosts = [];
    this.lstInfoPosts = [];
    this.mostViewType = CAROUSEL_TYPE.BEST_VIEW;
    this.mostInterestedType = CAROUSEL_TYPE.BEST_INTERESTED;
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

    this._loadingService.loading(false);
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
}
