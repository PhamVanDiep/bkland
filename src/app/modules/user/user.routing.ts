import { Route } from "@angular/router";
import { CreateMainPostComponent } from "./create-main-post/create-main-post.component";
import { AccountManagementComponent } from "./account-management/account-management.component";
import { ChargeComponent } from "./charge/charge.component";
import { BalanceFluctuationComponent } from "./balance-fluctuation/balance-fluctuation.component";
import { ManageMainPostComponent } from "./manage-main-post/manage-main-post.component";
import { CooperateAgencyComponent } from "./cooperate-agency/cooperate-agency.component";
import { RegisterComponent } from "./cooperate-agency/register/register.component";
import { InfoComponent } from "../common/info/info.component";
import { CreateInfoPostComponent } from "../common/info/create-info-post/create-info-post.component";
import { ManageConfigComponent } from "./manage-config/manage-config.component";
import { PriceFluctuationComponent } from "./price-fluctuation/price-fluctuation.component";

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
            },
            {
                path: 'info',
                children: [
                    {
                        path: '',
                        component: InfoComponent
                    },
                    {
                        path: 'create-info-post',
                        component: CreateInfoPostComponent
                    },
                    {
                        path: 'update-info-post/:id',
                        component: CreateInfoPostComponent
                    }
                ]
            }
        ]
    },
    {
        path: 'cooperate-agency',
        children: [
            {
                path: '',
                component: CooperateAgencyComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            }
        ]
    },
    {
        path: 'config',
        component: ManageConfigComponent
    },
    {
        path: 'price-fluctuation-notify',
        component: PriceFluctuationComponent
    }
]