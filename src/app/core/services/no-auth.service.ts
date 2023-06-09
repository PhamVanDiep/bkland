
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';
import { SpecialAccount } from '../models/special-account.model';
import { EmailVerify } from '../models/email-verify.model';

@Injectable({
  providedIn: 'root'
})
export class NoAuthService  {

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  getAllProvinces(): Observable<APIResponse> {
    return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/province`);
  }

  getProvinceByCode(code: string): Observable<APIResponse> {
    return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/province/${code}`);
  }

  getAllDistrictsInProvince(provinceCode: string): Observable<APIResponse> {
    return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/district/province/${provinceCode}`);
  }

  getAllWardsInDistrict(districtCode: string): Observable<APIResponse> {
    return this._httpClient.get<APIResponse>(`${environment.BASE_URL_NO_AUTH}/ward/district/${districtCode}`);
  }

  createSpecialAccount(specialAccount: SpecialAccount): Observable<APIResponse> {
    return this._httpClient.post<APIResponse>(`${environment.BASE_URL_NO_AUTH}/special-account`, specialAccount);
  }

  sendVerifyOTP(emailVerify: EmailVerify): Observable<any> {
    return this._httpClient.post<APIResponse>(`${environment.BASE_URL_NO_AUTH}/send-email`, emailVerify);
  }
}
