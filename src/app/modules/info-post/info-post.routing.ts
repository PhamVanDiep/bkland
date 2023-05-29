import { Route } from "@angular/router";
import { InfoPostComponent } from "./info-post.component";
import { InfoPostDetailComponent } from "./info-post-detail/info-post-detail.component";

export const route: Route[] = [
    {
        path: '',
        redirectTo: 'tin-tuc',
        pathMatch: 'full'
    },
    {
        path: 'tin-tuc',
        children: [
            {
                path: '',
                component: InfoPostComponent
            },
            {
                path: 'detail/:id',
                component: InfoPostDetailComponent
            }
        ]
    },
    {
        path: 'du-an',
        children: [
            {
                path: '',
                component: InfoPostComponent
            },
            {
                path: 'detail/:id',
                component: InfoPostDetailComponent
            }
        ]
    },
    {
        path: 'phong-thuy',
        children: [
            {
                path: '',
                component: InfoPostComponent
            },
            {
                path: 'detail/:id',
                component: InfoPostDetailComponent
            }
        ]
    },
    {
        path: 'quy-dinh',
        children: [
            {
                path: '',
                component: InfoPostComponent
            },
            {
                path: 'detail/:id',
                component: InfoPostDetailComponent
            }
        ]
    },
    {
        path: 'huong-dan',
        children: [
            {
                path: '',
                component: InfoPostComponent
            },
            {
                path: 'detail/:id',
                component: InfoPostDetailComponent
            }
        ]
    }
]