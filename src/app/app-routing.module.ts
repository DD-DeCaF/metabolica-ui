import { NgModule }              from '@angular/core';
import { RouterModule, Route }  from '@angular/router';
import { LoginModule } from "./login/login.module";

import { AppHomeComponent } from "./app-home/app-home.component";
import { LoginComponent } from "./login/login.component";

const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: AppHomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
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
