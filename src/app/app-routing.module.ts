import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {LoginModule} from './login/login.module';
import {AuthGuardService} from './session/auth-guard.service';
import {AppHomeComponent} from './app-home/app-home.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './login/logout.component';
import {ProjectComponent} from './project/project.component';
import {ProjectResolverService} from './project/project-resolver.service';
import {MediumListComponent} from './media/medium-list.component';
import {MediumComponent} from './media/medium.component';
import {AppWelcomeComponent} from './app-welcome/app-welcome.component';
import {ProjectDeactivationGuardService} from './project/project-deactivation-guard.service';

const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full'
  },
  {
    path: 'app',
    component: AppHomeComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: AppWelcomeComponent
      },
      {
        path: 'home',
        component: AppWelcomeComponent
      },
      {
        path: 'project/:project',
        component: ProjectComponent,
        resolve: {
          project: ProjectResolverService
        },
        canDeactivate: [ProjectDeactivationGuardService]
      },
      {
        path: 'media',
        component: MediumListComponent
      },
      {
        path: 'medium/:mediumId',
        component: MediumComponent
      }
    ]
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
    redirectTo: '/app/home'
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
