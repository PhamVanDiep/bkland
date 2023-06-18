import { Route } from "@angular/router";
import { DanhMucComponent } from "./danh-muc.component";
import { RealEstatePostViewComponent } from "../app-common/real-estate-post-view/real-estate-post-view.component";

export const routes: Route[] = [
    {
        path: '',
        component: DanhMucComponent
    },
    {
        path: ':id',
        component: RealEstatePostViewComponent
    }
]