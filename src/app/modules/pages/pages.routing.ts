import { Route } from "@angular/router";
import { VnpaySuccessComponent } from "./vnpay-success/vnpay-success.component";
import { ForbiddenComponent } from "./forbidden/forbidden.component";

export const route: Route[] = [
    {
        path: 'success-payment',
        component: VnpaySuccessComponent
    },
    {
        path: 'forbidden',
        component: ForbiddenComponent
    }
]