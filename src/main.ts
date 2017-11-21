import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {setAngularLib, UpgradeModule} from '@angular/upgrade/static';
import angular from 'angular';
import {Ng1AppModule} from './app/app-ng1/app-ng1.module';

if (environment.production) {
  enableProdMode();
}

setAngularLib(angular);

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(ref =>
    ref.injector.get(UpgradeModule)
      .bootstrap(document.body, [Ng1AppModule.name])
  )
  .catch(error => console.log(error)); // tslint:disable-line
