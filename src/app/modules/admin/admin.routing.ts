import { Route } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AboutComponent } from "./about/about.component";
import { FinanceTransactionComponent } from "./finance-transaction/finance-transaction.component";
import { MainPostComponent } from "./main-post/main-post.component";
import { UserAccountComponent } from "./user-account/user-account.component";
import { InfoComponent } from "./info/info.component";
import { CreateInfoPostComponent } from "./info/create-info-post/create-info-post.component";

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
    },
    {
        path: 'post',
        children: [
            {
                path: '', pathMatch: 'full', redirectTo: 'main'
            },
            {
                path: 'main',
                component: MainPostComponent
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
        path: 'manage-account',
        component: UserAccountComponent
    }
]