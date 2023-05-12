import { Route } from "@angular/router";
import { CreateMainPostComponent } from "./create-main-post/create-main-post.component";
import { AccountManagementComponent } from "./account-management/account-management.component";

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
    }
]