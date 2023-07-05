import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { ChartOptions } from '../../admin/admin.component';
import { APIResponse } from 'src/app/core/models/api-response.model';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-project-statistic',
  templateUrl: './project-statistic.component.html',
  styleUrls: ['./project-statistic.component.css']
})
export class ProjectStatisticComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  chart1Loading: boolean;
  chart2Loading: boolean;
  chart3Loading: boolean;
  chart4Loading: boolean;

  chart1Options: ChartOptions;
  chart2Options: ChartOptions;
  chart3Options: ChartOptions;
  chart4Options: ChartOptions;

  year: number;

  constructor(
    private _loadingService: LoadingService,
    private _messageService: MessageService,
    private _projectService: ProjectService
  ) {
    this.chart1Loading = false;
    this.chart2Loading = false;
    this.chart3Loading = false;
    this.chart4Loading = false;

    this.year = new Date().getFullYear();

    this.chart1Options = {
      chart: {
        type: 'donut',
        width: '100%'
      },
      dataLabels: {

      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }
    this.chart2Options = {
      chart: {
        type: 'donut',
        width: '100%'
      },
      dataLabels: {

      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }
    this.chart3Options = {
      chart: {
        type: 'donut',
        width: '100%'
      },
      dataLabels: {

      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }
    this.chart4Options = {
      chart: {
        type: 'donut',
        width: '100%'
      },
      dataLabels: {

      },
      labels: [],
      series: [],
      title: {},
      xaxis: {},
      yaxis: {}
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.fetchData();
  }

  fetchData(): void {
    this.getChart1Data();
    this.getChart2Data();
    this.getChart3Data();
    this.getChart4Data();
  }

  getChart1Data(): void {
    this.chart1Loading = true;
    this._projectService.statistic(1, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setChart1Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getChart2Data(): void {
    this.chart2Loading = true;
    this._projectService.statistic(2, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setChart2Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getChart3Data(): void {
    this.chart3Loading = true;
    this._projectService.statistic(3, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setChart3Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  getChart4Data(): void {
    this.chart4Loading = true;
    this._projectService.statistic(4, this.year)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((response: APIResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.setChart4Data(response.data);
        } else {
          this._messageService.errorMessage(response.message);
        }
      })
  }

  setChart1Data(data: any): void {
    this.chart1Options.labels = data.xaxis;
    this.chart1Options.series = data.series;
    this.chart1Loading = false;
  }

  setChart2Data(data: any): void {
    this.chart2Options.labels = data.xaxis;
    this.chart2Options.series = data.series;
    this.chart2Loading = false;
  }

  setChart3Data(data: any): void {
    this.chart3Options.labels = data.xaxis;
    this.chart3Options.series = data.series;
    this.chart3Loading = false;
  }

  setChart4Data(data: any): void {
    this.chart4Options.labels = data.xaxis;
    this.chart4Options.series = data.series;
    this.chart4Loading = false;
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
