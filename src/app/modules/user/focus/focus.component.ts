import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { PROJECT_TYPE_DROPDOWN } from 'src/app/core/constants/project.constant';
import { TYPE_DROPDOWN } from 'src/app/core/constants/type.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Project } from 'src/app/core/models/project.model';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { RealEstatePostService } from 'src/app/core/services/real-estate-post.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-focus',
  templateUrl: './focus.component.html',
  styleUrls: ['./focus.component.css']
})
export class FocusComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();
  private title: string = 'Bài đăng quan tâm';

  lstInterestedPosts: any[];
  lstProjects: Project[];
  projectTypes: any[];
  selectedProject: Project;
  preview: boolean;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  noInterest: number;

  constructor(
    private _appTitleService: AppTitleService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _realEstatePostService: RealEstatePostService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _userService: UserService,
    private _projectService: ProjectService
  ) {
    this._appTitleService.setTitle(this.title);
    this.innerWidth = window.innerWidth;
    this.projectTypes = PROJECT_TYPE_DROPDOWN;
    this.preview = false;
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    if (this._userService.isEnterprise()) {
      this._router.navigate(['pages/forbidden']);
    }
    this._loadingService.loading(true);
    let _id = JSON.parse(window.atob((localStorage.getItem('accessToken') || '').split('.')[1])).id;
    this._realEstatePostService.findByUserIdAndDeviceInfo(_id, '')
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.lstInterestedPosts = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      });

    this._realEstatePostService.interestPosts$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: number) => {
        this.noInterest = response;
      });

    this._projectService.findAllProjectsInterestedByUser()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.lstProjects = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  genTypeName(type: string): string {
    let types = TYPE_DROPDOWN;
    let response = '';
    types.forEach(e => {
      if (e.key === type) {
        response = e.value;
      }
    });
    return response;
  }

  getProjectAddress(project: Project): string {
    return project.address 
      + ', ' + project.ward.fullName 
      + ', ' + project.district.fullName 
      + ', ' + project.province.fullName;
  }

  viewPostDetail(postId: string): void {
    this._router.navigate([`./${postId}`], { relativeTo: this._route });
  }

  onCloseView(event: any): void {
    this.preview = false;
  }

  removeInterested(postId: string): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc chắn bỏ quan tâm bài viết này?',
        header: 'Bỏ quan tâm',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy',
        accept: () => {
          this._loadingService.loading(true);
          this._realEstatePostService.userInterested({
            realEstatePostId: postId
          })
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                if (response.message === "DELETED") {
                  this.noInterest--;
                  this._realEstatePostService.setInterestPosts(this.noInterest);
                  this.lstInterestedPosts = this.lstInterestedPosts.filter(e => e.id != postId);
                }
              } else {
                this._messageService.errorMessage(response.message);
              }
            })
        },
        reject: (type: any) => {
          switch(type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    )
  }

  getProjectTypeName(type: string): string {
    let res = '';
    this.projectTypes.forEach(e => {
      if (e.key == type) {
        res = e.value;
      }
    });
    return res;
  }

  deleteInterestedProject(projectId: string): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc chắn bỏ quan tâm dự án này?',
        header: 'Bỏ quan tâm',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy',
        accept: () => {
          this._loadingService.loading(true);
          this._projectService.userInterested({
            projectId: projectId
          })
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((response: APIResponse) => {
              this._loadingService.loading(false);
              if (response.status === HttpStatusCode.Ok) {
                if (response.message === "DELETED") {
                  this.lstProjects = this.lstProjects.filter(e => e.id != projectId);
                }
              } else {
                this._messageService.errorMessage(response.message);
              }
            })
        },
        reject: (type: any) => {
          switch(type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
