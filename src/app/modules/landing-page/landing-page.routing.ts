import { Route } from "@angular/router";
import { LandingPageComponent } from "./landing-page.component";
import { RealEstatePostViewComponent } from "../app-common/real-estate-post-view/real-estate-post-view.component";

export const route: Route[] = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: ':id',
        component: RealEstatePostViewComponent
    }
]