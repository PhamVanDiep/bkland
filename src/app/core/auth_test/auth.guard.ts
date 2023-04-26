import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {
    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const currentRole = 'user';
        const expectedRole = route.data['expectedRole'];
        if (currentRole === expectedRole) {
            return true;
        }
        this.router.navigate(['login'])
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const currentRole = 'user';
        const expectedRole = childRoute.data['expectedRole'];
        if (currentRole === expectedRole) {
            return true;
        }
        this.router.navigate(['login'])
        return false;
    }
}