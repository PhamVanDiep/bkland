import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './core/auth_test/auth.guard';
import { NoAuthGuardService as NoAuthGuard } from './core/auth_test/no-auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: '/user', pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/login/login.module').then(m => m.LoginModule)
      }
    ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
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
  exports: [RouterModule]
})
export class AppRoutingModule { }
