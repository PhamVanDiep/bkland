import { Route } from "@angular/router";
import { CreateMainPostComponent } from "./create-main-post/create-main-post.component";

export const route: Route[] = [
    {
        path: 'create-post',
        component: CreateMainPostComponent
    }
]