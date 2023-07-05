import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ReplaySubject, firstValueFrom, takeUntil } from 'rxjs';
import { PROJECT_TYPE_DROPDOWN } from 'src/app/core/constants/project.constant';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { District } from 'src/app/core/models/district.model';
import { Project } from 'src/app/core/models/project.model';
import { Province } from 'src/app/core/models/province.model';
import { Ward } from 'src/app/core/models/ward.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NoAuthService } from 'src/app/core/services/no-auth.service';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, OnDestroy{
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  projectTypes: any[];
  provinces: Province[];
  districts: District[];
  wards: Ward[];

  project: Project;
  selectedFile: any;
  imageRetrive: any;

  newId: number;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  isUpdate: boolean;

  constructor(
    private _noAuthService: NoAuthService,
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private _projectService: ProjectService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _mediaService: MediaService
  ) {
    this.projectTypes = PROJECT_TYPE_DROPDOWN;
    this.provinces = [];
    this.districts = [];
    this.wards = [];
    this.project = {
      address: '',
      area: 0.0,
      createAt: null,
      createBy: '',
      district: {
        code: '',
        administrativeUnitId: 1,
        codeName: '',
        fullName: '',
        fullNameEn: '',
        name: '',
        nameEn: '',
        provinceCode: ''
      },
      email: '',
      enable: true,
      id: '',
      imageUrl: '',
      name: '',
      phoneNumber: '',
      projectParams: [],
      province: {
        code: '',
        administrativeRegion: '',
        administrativeUnit: '',
        codeName: '',
        fullName: '',
        fullNameEn: '',
        name: '',
        nameEn: ''
      },
      type: '',
      updateAt: null,
      updateBy: '',
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
      content: ''
    };
    this.newId = -1;
    let path = this._router.url.split('/');
    if (path[path.length - 1] == 'create') {
      this.isUpdate = false;
    } else {
      this.isUpdate = true;
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
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
      this._loadingService.loading(true);
      let projectId = this._route.snapshot.paramMap.get('id') || '';
      this._projectService.findById(projectId)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.project = response.data;
            this.retriveImage(this.project.imageUrl);
            this.getDistrictsInProvince();
            this.getWardsInDistrict();
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
  }

  retriveImage(id: string): void {
    this._mediaService.getImage(id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.imageRetrive = this._mediaService.getImgSrc(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getDistrictsInProvince(): void {
    if (this.project.province != null && this.project.province.code.length > 0) {
      this._noAuthService.getAllDistrictsInProvince(this.project.province.code)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.districts = response.data.filter((e: any) => e.code != "NOT_FOUND");
          } else {
            this._messageService.errorMessage(response.message);
          }
        }) 
    }
  }

  getWardsInDistrict(): void {
    if (this.project.district != null && this.project.district.code.length > 0) {
      this._noAuthService.getAllWardsInDistrict(this.project.district.code)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          if (response.status === HttpStatusCode.Ok) {
            this.wards = response.data.filter((e: any) => e.code != "NOT_FOUND");
          } else {
            this._messageService.errorMessage(response.message);
          }
        }) 
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile == null || this.selectedFile == undefined) {
      return;
    }
    if (Math.round(this.selectedFile.size / 1048576) > 16) {
      this.selectedFile = null;
      this._messageService.errorMessage('Kích thước ảnh tối đa là 16MB');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (_event) => {
      this.imageRetrive = reader.result;
    }
  }

  addParam(): void {
    this.project.projectParams.push({
      id: this.newId,
      name: '',
      projectId: this.project.id,
      value: ''
    });
    this.newId--;
  }

  deleteItem(itemId: number): void {
    if (itemId < 0) {
      this.project.projectParams = this.project.projectParams.filter(e => e.id != itemId);
    } else {
      this._confirmationService.confirm(
        {
          message: 'Bạn có chắc chắn muốn xóa thông tin đặc trưng này?',
          header: 'Xóa thông tin đặc trưng',
          acceptButtonStyleClass: 'p-button-success',
          rejectButtonStyleClass: 'p-button-outlined',
          acceptLabel: 'Xác nhận',
          rejectLabel: 'Hủy',
          accept: () => {
            this.deleteProjectParam(itemId);
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
  }

  deleteProjectParam(id: number): void {
    this._loadingService.loading(true);
    this._projectService.deleteParam(id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        this._loadingService.loading(false);
        if (response.status === HttpStatusCode.Ok) {
          this.project.projectParams = this.project.projectParams.filter(e => e.id != id);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  goBack(): void {
    this._router.navigate(['../../'], { relativeTo: this._route });
  }

  async onSave() {
    if (this.isUpdate) {
      this._loadingService.loading(true);
      if (this.selectedFile != null) {
        let formData = new FormData();
        formData.append('title', this.selectedFile.type);
        formData.append('image', this.selectedFile, this.selectedFile.name);
        let response = await firstValueFrom(this._mediaService.postImage(formData).pipe(takeUntil(this._unsubscribe)));
        if (response.status === HttpStatusCode.Ok) {
          this.project.imageUrl = response.data;
        } else {
          this._loadingService.loading(false);
          this._messageService.errorMessage(response.message);
          return;
        }
      }

      let updateResponse = await firstValueFrom(this._projectService.update(this.project).pipe(takeUntil(this._unsubscribe)));
      if (updateResponse.status === HttpStatusCode.Ok) {
        this._messageService.successMessage(updateResponse.message);
        this._loadingService.loading(false);
        setTimeout(() => {
          this._router.navigate(['../../'], { relativeTo: this._route });
        }, 2000);
      } else {
        this._loadingService.loading(false);
        this._messageService.errorMessage(updateResponse.message);
        return;
      }
    } else {
      if (this.selectedFile == null) {
        this._messageService.warningMessage('Bạn chưa chọn ảnh minh họa');
      }
      this._loadingService.loading(true);
      let formData = new FormData();
      formData.append('title', this.selectedFile.type);
      formData.append('image', this.selectedFile, this.selectedFile.name);
      let response = await firstValueFrom(this._mediaService.postImage(formData).pipe(takeUntil(this._unsubscribe)));
      if (response.status === HttpStatusCode.Ok) {
        this.project.imageUrl = response.data;
      } else {
        this._loadingService.loading(false);
        this._messageService.errorMessage(response.message);
        return;
      }

      let createResponse = await firstValueFrom(this._projectService.create(this.project).pipe(takeUntil(this._unsubscribe)));
      if (createResponse.status === HttpStatusCode.Ok) {
        this._messageService.successMessage(createResponse.message);
        this._loadingService.loading(false);
        setTimeout(() => {
          this._router.navigate(['../'], { relativeTo: this._route });
        }, 2000);
      } else {
        this._loadingService.loading(false);
        this._messageService.errorMessage(createResponse.message);
        return;
      }
    }
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
