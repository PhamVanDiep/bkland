
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';
import { About } from '../models/about.model';

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

  updateAboutInfo(about: About): Observable<APIResponse> {
    let accessToken = localStorage.getItem('accessToken');
    return this._httpClient.put<APIResponse>(`${environment.BASE_URL_AUTH}/about`, about, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
