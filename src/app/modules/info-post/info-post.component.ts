import { HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { TinTucResponse } from 'src/app/core/models/info-post.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { InfoPostService } from 'src/app/core/services/info-post.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import Util from 'src/app/core/utils/util';

@Component({
  selector: 'app-info-post',
  templateUrl: './info-post.component.html',
  styleUrls: ['./info-post.component.css']
})
export class InfoPostComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = '';
  tinTucResponses: TinTucResponse[];
  private selectedType: number;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _infoPostService: InfoPostService,
    private _mediaService: MediaService,
    private _domSanitizer: DomSanitizer
  ) {
    this.title = this._router.url;
    if (this.title.includes('du-an')) {
      this.selectedType = 1;
      this.title = 'Dự án';
    } else if (this.title.includes('tin-tuc')) {
      this.selectedType = 2;
      this.title = 'Tin tức';
    } else if (this.title.includes('phong-thuy')) {
      this.selectedType = 3;
      this.title = 'Phong thủy';
    } else if (this.title.includes('quy-dinh')) {
      this.selectedType = 4;
      this.title = 'Quy định';
    } else if (this.title.includes('huong-dan')) {
      this.selectedType = 5;
      this.title = 'Hướng dẫn';
    } else {
      this._router.navigate(['pages/not-found'])
    }
    this.tinTucResponses = [];
    this._appTitleService.setTitle(this.title);
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._infoPostService.findByInfoType(this.selectedType)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          if (this.selectedType === 2) {
            this.tinTucResponses = response.data;
          } else {
            this.tinTucResponses.push(response.data);
          }
          this.tinTucResponses.forEach(e => {
            e.currInfoPosts = e.infoPosts;
            e.selectedPages = [];
            e.selectedPages.push(0);
            e.infoPosts.forEach(ee => {
              this._mediaService.retriveImage(ee.imageUrl)
                .pipe(takeUntil(this._unsubscribe))
                .subscribe((response1: APIResponse) => {
                  if (response1.status === HttpStatusCode.Ok) {
                    ee.retriveImage = this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${response1.data.type};base64,${response1.data.body}`);
                  } else {
                    ee.retriveImage = '';
                    this._messageService.errorMessage(response1.message);
                  }
                });
            });
            this._infoPostService.countByInfoType(e.infoType.id)
              .pipe(takeUntil(this._unsubscribe))
              .subscribe((response2: APIResponse) => {
                if (response2.status === HttpStatusCode.Ok) {
                  e.totalRecords = response2.data;
                } else {
                  this._messageService.errorMessage(response2.message);
                }
              });
          });
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  showDetail(id: number): void {
    this._router.navigate([`./detail/${id}`], { relativeTo: this._route });
  }

  onPageChange(event: any, tinTucResponse: TinTucResponse): void {
    if (this.tinTucResponses.length <= 1) {
      Util.scrollToTop();
    }
    let selectedPage = event.page;
    if (!tinTucResponse.selectedPages.includes(selectedPage)) {
      tinTucResponse.selectedPages.push(selectedPage);
      this._loadingService.loading(true);
      this._infoPostService.loadMore(tinTucResponse.infoType.id, 5, selectedPage)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            response.data.forEach((e: any) => {
              this._mediaService.retriveImage(e.imageUrl)
                .pipe(takeUntil(this._unsubscribe))
                .subscribe((response1: APIResponse) => {
                  if (response1.status === HttpStatusCode.Ok) {
                    e.retriveImage = this._domSanitizer.bypassSecurityTrustResourceUrl(`data:${response1.data.type};base64,${response1.data.body}`);
                  } else {
                    e.retriveImage = '';
                    this._messageService.errorMessage(response1.message);
                  }
                });
            })
            tinTucResponse.currInfoPosts = response.data;
            tinTucResponse.infoPosts = [...tinTucResponse.infoPosts, ...response.data];
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    } else {
      if (selectedPage == event.pageCount - 1) {
        tinTucResponse.currInfoPosts = tinTucResponse.infoPosts.slice(selectedPage * 5, tinTucResponse.totalRecords);
      } else {
        tinTucResponse.currInfoPosts = tinTucResponse.infoPosts.slice(selectedPage * 5, (selectedPage + 1) * 5);
      }
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
