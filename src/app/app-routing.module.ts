import {NgModule} from '@angular/core';
import {RouterModule, Route} from '@angular/router';
import {LoginModule} from "./login/login.module";
import {AuthGuardService} from "./session/auth-guard.service";
import {AppHomeComponent} from "./app-home/app-home.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./login/logout.component";

const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: AppHomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: '**',
    redirectTo: '/home'
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    LoginModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
