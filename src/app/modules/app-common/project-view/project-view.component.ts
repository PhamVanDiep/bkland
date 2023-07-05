import { HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { Project } from 'src/app/core/models/project.model';
import { CommentService } from 'src/app/core/services/comment.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MediaService } from 'src/app/core/services/media.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  @Input() project: Project;
  @Input() administrative: boolean;
  @Input() isInterested: boolean;

  @Output() closeView = new EventEmitter<boolean>();
  @Output() onInteresting = new EventEmitter<void>();

  imageRetrive: any;

  displayComment: boolean;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _projectService: ProjectService,
    private _mediaService: MediaService,
    private _commentService: CommentService
  ) {
    this.displayComment = false;
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    if (this.project.imageUrl != undefined && this.project.imageUrl != null && this.project.imageUrl.length > 0) {
      this._loadingService.loading(true);
      this._mediaService.getImage(this.project.imageUrl)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe((response: APIResponse) => {
          this._loadingService.loading(false);
          if (response.status === HttpStatusCode.Ok) {
            this.imageRetrive = this._mediaService.getImgSrc(response.data);
          } else {
            this._messageService.errorMessage(response.message);
          }
        })
    }
    if (!this.administrative) {
      this._projectService.increaseView(this.project.id)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe();
    }
    if (this.isInterested == undefined || this.isInterested == null) {
      this.isInterested = false;
    }
  }

  goBack(): void {
    this.closeView.next(true);
  }

  onInterest(): void {
    this.onInteresting.next();
  }

  comment(): void {
    this._commentService.showComment();
    this._commentService.setPostId(this.project.id);
  }

  onCloseComment(event: any): void {
    this._commentService.hideComment();
  }
}
