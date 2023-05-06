import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuardService as AuthGuard } from './core/auth_test/auth.guard';
// import { NoAuthGuardService as NoAuthGuard } from './core/auth_test/no-auth.guard';
import { AuthGuardService as AuthGuard } from 'src/app/core/guards/auth.guard';
import { NoAuthGuardService as NoAuthGuard } from 'src/app/core/guards/no-auth.guard';
import { ROLE } from './core/constants/role.constant';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { AdministrationLayoutComponent } from 'src/app/layout/administration-layout/administration-layout.component';

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
    component: MainLayoutComponent,
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
