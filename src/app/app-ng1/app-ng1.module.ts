import angular from 'angular';
import 'ancestry';
import {downgradeComponent} from '@angular/upgrade/static';
import {AppComponent} from '../app.component';

// root component for angularJS (used in index.html)
const Ng1RootComponent = {
  template: `<ng2root></ng2root>`
};

// downgrade the angular root component (AppComponent) to use it in Ng1RootComponent
const Ng2RootDirective = downgradeComponent({
  component: AppComponent
} as angular.IDirectiveFactory);

// angularJS app module (bootstrapped in main.ts)
export const Ng1AppModule = angular
  .module('ng1App', ['ancestry'])
  .component('ng1root', Ng1RootComponent)
  .directive('ng2root', Ng2RootDirective);

