import { Route } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AboutComponent } from "./about/about.component";
import { FinanceTransactionComponent } from "./finance-transaction/finance-transaction.component";

export const route: Route[] = [
    {
        path: '',
        component: AdminComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'finance-transaction',
        component: FinanceTransactionComponent
    }
]