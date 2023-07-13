import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuardService as AuthGuard } from './core/auth_test/auth.guard';
// import { NoAuthGuardService as NoAuthGuard } from './core/auth_test/no-auth.guard';
import { AuthGuardService as AuthGuard } from 'src/app/core/guards/auth.guard';
import { NoAuthGuardService as NoAuthGuard } from 'src/app/core/guards/no-auth.guard';
import { ROLE } from './core/constants/role.constant';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { AdministrationLayoutComponent } from 'src/app/layout/administration-layout/administration-layout.component';
import { ForumComponent } from './modules/forum/forum.component';
import { PROJECT_ROUTE } from './core/constants/other.constant';

const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: 'signed-in-redirect', pathMatch: 'full', redirectTo: '/home'
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/auth/sign-in/sign-in.module').then(m => m.SignInModule)
      }
    ]
  },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/auth/sign-up/sign-up.module').then(m => m.SignUpModule)
      }
    ]
  },
  {
    path: 'home',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/landing-page/landing-page.module').then(m => m.LandingPageModule)
      }
    ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      expectedRole: ROLE.ROLE_USER
    },
    component: AdministrationLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/user/user.module').then(m => m.UserModule)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      expectedRole: ROLE.ROLE_ADMIN
    },
    component: AdministrationLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  {
    path: 'pages',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/pages/pages.module').then(m => m.PagesModule)
      }
    ]
  },
  {
    path: 'tien-ich',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/info-post/info-post.module').then(m => m.InfoPostModule)
      }
    ]
  },
  {
    path: 'cong-dong',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/forum/forum.module').then(m => m.ForumModule)
      }
    ]
  },
  {
    path: 'mua-ban/nha-dat',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/danh-muc/danh-muc.module').then(m => m.DanhMucModule)
      }
    ]
  },
  {
    path: 'mua-ban/chung-cu',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/danh-muc/danh-muc.module').then(m => m.DanhMucModule)
      }
    ]
  },
  {
    path: 'mua-ban/dat-nen',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/danh-muc/danh-muc.module').then(m => m.DanhMucModule)
      }
    ]
  },
  {
    path: 'cho-thue/nha-dat',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/danh-muc/danh-muc.module').then(m => m.DanhMucModule)
      }
    ]
  },
  {
    path: 'cho-thue/chung-cu',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/danh-muc/danh-muc.module').then(m => m.DanhMucModule)
      }
    ]
  },
  {
    path: 'tim-kiem',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/danh-muc/danh-muc.module').then(m => m.DanhMucModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.CAN_HO_CHUNG_CU}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.CAO_OC_VAN_PHONG}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.TRUNG_TAM_THUONG_MAI}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.KHU_DO_THI_MOI}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.KHU_PHUC_HOP}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.NHA_O_XA_HOI}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.KHU_NGHI_DUONG_SINH_THAI}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.KHU_CONG_NGHIEP}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.BIET_THU_LIEN_KE}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.SHOP_HOUSE}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.NHA_MAT_PHO}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  },
  {
    path: `du-an/${PROJECT_ROUTE.DU_AN_KHAC}`,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/du-an/du-an.module').then(m => m.DuAnModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    NoAuthGuard
  ]
})
export class AppRoutingModule { }
