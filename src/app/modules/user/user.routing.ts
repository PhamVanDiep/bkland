import { Route } from "@angular/router";
import { CreateMainPostComponent } from "./create-main-post/create-main-post.component";

export const route: Route[] = [
    {
        path: 'create-post',
        component: CreateMainPostComponent
    },
    {
        path: 'update-post/:id',
        component: CreateMainPostComponent
    }
]