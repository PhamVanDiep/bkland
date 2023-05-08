
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AboutService  {

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  getAboutInfo(): Observable<APIResponse> {
    return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/about`);
  }
}
