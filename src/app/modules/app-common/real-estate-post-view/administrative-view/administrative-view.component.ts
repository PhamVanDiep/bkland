import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-administrative-view',
  templateUrl: './administrative-view.component.html',
  styleUrls: ['./administrative-view.component.css']
})
export class AdministrativeViewComponent implements OnInit, OnDestroy {
  private _unsubscribe: ReplaySubject<any> = new ReplaySubject<any>();

  postId: string;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.postId = this._route.snapshot.paramMap.get('id') || '';
  }

  goBack(): void {
    history.back();
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
