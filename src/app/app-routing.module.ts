import { NgModule }              from '@angular/core';
import {RouterModule, Route }  from '@angular/router';
import { AppHomeComponent } from "./app-home/app-home.component";


const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: AppHomeComponent
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
