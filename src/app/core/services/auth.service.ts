
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from '../models/sign-in.model';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/api-response.model';
import { environment } from 'src/environments/environment';
import { RefreshTokenRequest } from '../models/refresh-token.model';
import { SignUpRequest } from '../models/sign-up.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  constructor(
    private jwtHelper: JwtHelperService,
    private _httpClient: HttpClient
  ) {
  }

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !this.jwtHelper.isTokenExpired(accessToken);
  }

  login(body: Login): Observable<APIResponse> {
    return this._httpClient.post<APIResponse>(`${environment.API_URL}/auth/signin`, body);
  }

  loginByRefreshToken(body: RefreshTokenRequest): Observable<APIResponse> {
    return this._httpClient.post<APIResponse>(`${environment.API_URL}/auth/refresh`, body);
  }

  checkEmailExist(email: string): Observable<APIResponse> {
    return this._httpClient.get<APIResponse>(`${environment.API_URL}/auth/email-exist/${email}`);
  }

  register(register: SignUpRequest): Observable<any> {
    return this._httpClient.post<APIResponse>(`${environment.API_URL}/auth/signup`, register);
  }
}
