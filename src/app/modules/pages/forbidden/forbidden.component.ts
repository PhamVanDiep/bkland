import { Component } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent {

  constructor(
    private _loadingService: LoadingService
  ) {
    this._loadingService.loading(false);
  }

  back(): void {
    history.go(history.length > 1 ? -2 : -1);
  }
}
