import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { PROJECT_TYPE_DROPDOWN, PROJECT_TYPE_DROPDOWN_TABLE_FILTER } from 'src/app/core/constants/project.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Project } from 'src/app/core/models/project.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }
  projectTypes: any[];
  lstProjects: Project[];
  lstProjectsSrc: Project[];

  preview: boolean;
  selectedProject: Project;

  lstTypeDropdown: any[];
  selectedType: string;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _projectService: ProjectService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _confirmationService: ConfirmationService
  ) {
    this.innerWidth = window.innerWidth;
    this.lstProjects = [];
    this.projectTypes = PROJECT_TYPE_DROPDOWN;
    this.preview = false;
    this.selectedType = 'ALL';
    this.lstTypeDropdown = PROJECT_TYPE_DROPDOWN_TABLE_FILTER;
  }

  filterByType(): void {
    if (this.selectedType == 'ALL') {
      this.lstProjects = this.lstProjectsSrc;
    } else {
      this.lstProjects = this.lstProjectsSrc.filter(e => e.type == this.selectedType);
    }
  }
  deleteProject(id: string): void {
    this._confirmationService.confirm(
      {
        message: 'Bạn có chắc chắn muốn xóa dự án này?',
        header: 'Xóa dự án',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-outlined',
        acceptLabel: 'Xác nhận',
        rejectLabel: 'Hủy',
        accept: () => {
          this.deleteProjectCallAPI(id);
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

  deleteProjectCallAPI(id: string): void {
    this._loadingService.loading(true);
    this._projectService.deleteProject(id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this._messageService.successMessage(response.message);
          this.lstProjects = this.lstProjects.filter(e => e.id != id);
          this.lstProjectsSrc = this.lstProjectsSrc.filter(e => e.id != id);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
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

  getProjectAddress(project: Project): string {
    return project.address 
      + ', ' + project.ward.fullName 
      + ', ' + project.district.fullName 
      + ', ' + project.province.fullName;
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this._loadingService.loading(true);
    this._projectService.findAll()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.lstProjects = response.data;
          this.lstProjectsSrc = response.data;
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  onCloseView(event: any): void {
    this.preview = false;
  }
}
