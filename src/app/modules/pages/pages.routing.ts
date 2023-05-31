import { Route } from "@angular/router";
import { VnpaySuccessComponent } from "./vnpay-success/vnpay-success.component";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { NotFoundComponent } from "./not-found/not-found.component";

export const route: Route[] = [
    {
        path: '', redirectTo: 'not-found', pathMatch: 'full'
    },
    {
        path: 'success-payment',
        component: VnpaySuccessComponent
    },
    {
        path: 'forbidden',
        component: ForbiddenComponent
    },
    {
        path: 'not-found',
        component: NotFoundComponent
    }
]