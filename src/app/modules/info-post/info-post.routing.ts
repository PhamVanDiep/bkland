import { Route } from "@angular/router";
import { InfoPostComponent } from "./info-post.component";

export const route: Route[] = [
    {
        path: '',
        component: InfoPostComponent
    },
    {
        path: 'tin-tuc',
        component: InfoPostComponent
    },
    {
        path: 'du-an',
        component: InfoPostComponent
    },
    {
        path: 'phong-thuy',
        component: InfoPostComponent
    },
    {
        path: 'quy-dinh',
        component: InfoPostComponent
    },
    {
        path: 'huong-dan',
        component: InfoPostComponent
    }
]