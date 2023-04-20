import { Component, OnInit } from '@angular/core';
import { AppTitleService } from './core/services/app-title.service';
import { AppUpdateService } from './core/services/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'bkland-fe';

  constructor(
    private _appTitleService: AppTitleService,
    private _appUpdateService: AppUpdateService
  ) {
    // this._appTitleService.setTitle("Hello world");
    this._appUpdateService.update();
  }

  ngOnInit(): void {
    this._appUpdateService.reload$
      .subscribe((response: boolean) => {
        if (response) {
          this.reload();
        }
      })
  }

  reload(): void {
    // this._messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Đã cài đặt phiên bản mới, hệ thống sẽ tải lại sau 5s' });
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
}
