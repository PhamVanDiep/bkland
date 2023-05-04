import { Component } from '@angular/core';
import { AppTitleService } from 'src/app/core/services/app-title.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  private title: string = 'Đăng ký';

  constructor(
    private _appTitleService: AppTitleService,
  ) {
    this._appTitleService.setTitle(this.title);
  }
}
