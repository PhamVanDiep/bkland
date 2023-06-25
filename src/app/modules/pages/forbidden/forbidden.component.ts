import { Component } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent {
  back(): void {
    history.go(history.length > 1 ? -2 : -1);
  }
}
