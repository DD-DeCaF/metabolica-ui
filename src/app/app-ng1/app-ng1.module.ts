import angular from 'angular';
import 'ancestry';
import {downgradeComponent} from '@angular/upgrade/static';
import {AppComponent} from '../app.component';

const Ng1RootComponent = {
  template: `<ng2root></ng2root>`
};


export const Ng1AppModule = angular
  .module('ng1App', ['ancestry'])
  .component('ng1root', Ng1RootComponent)
  .directive('ng2root', downgradeComponent({
    component: AppComponent
  } as angular.IDirectiveFactory));
