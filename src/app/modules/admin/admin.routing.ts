import { Route } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AboutComponent } from "./about/about.component";
import { FinanceTransactionComponent } from "./finance-transaction/finance-transaction.component";
import { MainPostComponent } from "./main-post/main-post.component";
import { UserAccountComponent } from "./user-account/user-account.component";
import { InfoComponent } from "../app-common/info/info.component";
import { CreateInfoPostComponent } from "../app-common/info/create-info-post/create-info-post.component";
import { ManageConfigComponent } from "../app-common/manage-config/manage-config.component";
import { ManageForumComponent } from "../app-common/create-forum-post/manage-forum/manage-forum.component";
import { CreateForumPostComponent } from "../app-common/create-forum-post/create-forum-post.component";
import { ReportComponent } from "./report/report.component";

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
            },
            {
                path: 'forum',
                children: [
                    {
                        path: '',
                        component: ManageForumComponent
                    },
                    {
                        path: 'create',
                        component: CreateForumPostComponent
                    },
                    {
                        path: 'update/:id',
                        component: CreateForumPostComponent
                    }
                ]
            }
        ]
    },
    {
        path: 'manage-account',
        component: UserAccountComponent
    },
    {
        path: 'config',
        component: ManageConfigComponent
    },
    {
        path: 'report',
        component: ReportComponent
    }
]