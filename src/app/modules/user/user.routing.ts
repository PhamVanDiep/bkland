import { Route } from "@angular/router";
import { CreateMainPostComponent } from "./create-main-post/create-main-post.component";
import { AccountManagementComponent } from "./account-management/account-management.component";
import { ChargeComponent } from "./charge/charge.component";
import { BalanceFluctuationComponent } from "./balance-fluctuation/balance-fluctuation.component";
import { ManageMainPostComponent } from "./manage-main-post/manage-main-post.component";
import { CooperateAgencyComponent } from "./cooperate-agency/cooperate-agency.component";

export const route: Route[] = [
    {
        path: 'create-post',
        component: CreateMainPostComponent
    },
    {
        path: 'update-post/:id',
        component: CreateMainPostComponent
    },
    {
        path: 'account-management',
        component: AccountManagementComponent
    },
    {
        path: 'recharge',
        component: ChargeComponent
    },
    {
        path: 'balance-fluctuation',
        component: BalanceFluctuationComponent
    },
    {
        path: 'post',
        children: [
            {
                path: '',
                redirectTo: 'main',
                pathMatch: 'full'
            },
            {
                path: 'main',
                component: ManageMainPostComponent
            }
        ]
    },
    {
        path: 'cooperate-agency',
        component: CooperateAgencyComponent
    }
]