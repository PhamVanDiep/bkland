import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { ChartOptions } from 'src/app/modules/admin/admin.component';

@Component({
  selector: 'app-project-detail-statistic',
  templateUrl: './project-detail-statistic.component.html',
  styleUrls: ['./project-detail-statistic.component.css']
})
export class ProjectDetailStatisticComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  @Input() projectId: string;
  months: any[];
  years: any[];

  month: number;
  year: number;

  viewChartOptions: ChartOptions;
  interestedChartOptions: ChartOptions;
  commentChartOptions: ChartOptions;

  interestedChartLoading: boolean;
  commentChartLoading: boolean;
  viewChartLoading: boolean;
  
  constructor(
    private _messageService: MessageService,
    private _projectService: ProjectService,
  ) {
  }

  fetchData(): void {

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
    throw new Error('Method not implemented.');
  }
}
