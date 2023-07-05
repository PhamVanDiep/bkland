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
import { ReportDetailComponent } from "./report/report-detail/report-detail.component";
import { ForumPostDetailComponent } from "./forum-post-detail/forum-post-detail.component";
import { ChatComponent } from "../app-common/chat/chat.component";
import { AdministrativeViewComponent } from "../app-common/real-estate-post-view/administrative-view/administrative-view.component";
import { DashboardPostComponent } from "./dashboard/dashboard-post/dashboard-post.component";
import { DashboardPriceComponent } from "./dashboard/dashboard-price/dashboard-price.component";
import { ProjectComponent } from "./project/project.component";
import { DashboradProjectComponent } from "./dashboard/dashborad-project/dashborad-project.component";

export const route: Route[] = [
    {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
    },
    {
        path: 'dashboard',
        children: [
            {
                path: '', pathMatch: 'full', redirectTo: 'price'
            },
            {
                path: 'price',
                component: AdminComponent
            },
            {
                path: 'post',
                component: DashboardPostComponent
            },
            {
                path: 'user-balance',
                component: DashboardPriceComponent
            },
            {
                path: 'project',
                component: DashboradProjectComponent
            }
        ]
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
                children: [
                    {
                        path: '',
                        component: MainPostComponent
                    },
                    {
                        path: ':id',
                        component: AdministrativeViewComponent
                    }
                ]
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
                    },
                    {
                        path: 'detail/:id',
                        component: ForumPostDetailComponent
                    }
                ]
            },
            {
                path: 'project',
                component: ProjectComponent
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
        children: [
            {
                path: '',
                component: ReportComponent
            },
            {
                path: 'detail/:id',
                component: ReportDetailComponent
            }
        ]
    },
    {
        path: 'chat',
        component: ChatComponent
    }
]