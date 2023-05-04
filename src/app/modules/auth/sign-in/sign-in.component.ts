import { Component } from '@angular/core';
import { AppTitleService } from 'src/app/core/services/app-title.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  private title: string = 'Đăng nhập';

  constructor(
    private _appTitleService: AppTitleService,
  ) {
    this._appTitleService.setTitle(this.title);
  }
}
