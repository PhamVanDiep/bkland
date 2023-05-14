import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { RefreshTokenRequest, RefreshTokenResponse } from "../models/refresh-token.model";
import { APIResponse } from "../models/api-response.model";
import { HttpStatusCode } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {
    constructor(
        private _authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {

        const redirectUrl = state.url === '/logout' ? '/' : state.url;
        const expectedRole = route.data['expectedRole'];
        return this._check(redirectUrl, expectedRole);

        // const currentRole = 'user';
        // const expectedRole = route.data['expectedRole'];
        // if (currentRole === expectedRole) {
        //     return true;
        // }
        // this.router.navigate(['login'])
        // return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        // const currentRole = 'user';
        // const expectedRole = childRoute.data['expectedRole'];
        // if (currentRole === expectedRole) {
        //     return true;
        // }
        // this.router.navigate(['login'])
        // return false;
        const redirectUrl = state.url === '/logout' ? '/' : state.url;
        const expectedRole = childRoute.data['expectedRole'];
        return this._check(redirectUrl, expectedRole);
    }

    private checkRole(expectedRole: string, redirectUrl: string): boolean {
        let roles = localStorage.getItem('roles');
        if (roles) {
            let lstRoles = roles.split(',');
            if (lstRoles.length >= 0) {
                if (lstRoles.includes(expectedRole)) {
                    return true;
                } else {
                    this.router.navigate(['pages/forbidden']);
                    return false;
                }
            } else {
                this.router.navigate(['login'], { queryParams: {redirectUrl} });
                return false;
            }
        } else {
            this.router.navigate(['login'], { queryParams: {redirectUrl} });
            return false;
        }
    }

    private _check(redirectUrl: string, expectedRole: string): boolean {
        let accessToken = localStorage.getItem('accessToken');
        // if accessToken not null
        if (accessToken) {
            // if access token not exp
            if (this._authService.isAuthenticated()) {
                // let decodedJWT = JSON.parse(window.atob(accessToken.split('.')[1]));
                return this.checkRole(expectedRole, redirectUrl);
            } else {
                const refreshToken = localStorage.getItem('refreshToken');
                let refreshTokenRequest: RefreshTokenRequest = {
                    refreshToken: refreshToken != null ? refreshToken : ""
                }
                if (refreshToken) {
                    this._authService.loginByRefreshToken(refreshTokenRequest)
                        .subscribe((apiResponse: APIResponse) => {
                            if (apiResponse?.status === HttpStatusCode.Ok) {
                                let refreshTokenData: RefreshTokenResponse = apiResponse.data;
                                localStorage.setItem('accessToken', refreshTokenData.accessToken)
                            } else {
                                this.router.navigate(['login'], { queryParams: {redirectUrl} });
                            }
                        });
                    this.checkRole(expectedRole, redirectUrl);
                } else {
                    this.router.navigate(['login'], { queryParams: {redirectUrl} });
                }
            }
        } else {
            this.router.navigate(['login'], { queryParams: {redirectUrl} });
        }
        return false;
    }
}