import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';
import {Ng2Webstorage} from 'ngx-webstorage';
import {POTION_CONFIG, POTION_RESOURCES, PotionModule} from 'potion-client';

import {AppMaterialModule} from './app-material.module';
import {AppRoutingModule} from './app-routing.module';
import {SessionModule} from './session/session.module';
import {SearchModule} from './search/search.module';
import {RegistryModule} from './registry/registry.module';
import {SharingModule} from './sharing/sharing.module';
import {ClipboardModule} from './clipboard/clipboard.module';
import {AppAuthService} from './app-auth.service';
import {AppComponent} from './app.component';
import {AppToolbarComponent} from './app-toolbar/app-toolbar.component';
import {AppHomeComponent} from './app-home/app-home.component';
import {XrefsModule} from './xrefs/xrefs.module';
import {MaintenanceModule} from './maintenance/maintenance.module';
import {ProjectModule} from './project/project.module';
import {MediaModule} from './media/media.module';
import {resources} from './app.resources';
import {AppCommonModule} from './app-common/app-common.module';
import { AppWelcomeComponent } from './app-welcome/app-welcome.component';
import {CompareModule} from './compare/compare.module';
import {UpgradeModule} from '@angular/upgrade/static';

@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    AppHomeComponent,
    AppWelcomeComponent
  ],
  imports: [
    UpgradeModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    PotionModule,
    HttpClientModule,
    Ng2Webstorage,
    AppRoutingModule,
    AppMaterialModule,
    SessionModule,
    SearchModule,
    RegistryModule,
    XrefsModule,
    SharingModule,
    ClipboardModule,
    MaintenanceModule,
    ProjectModule,
    MediaModule,
    AppCommonModule,
    CompareModule
  ],
  providers: [
    AppAuthService,
    {
      provide: POTION_RESOURCES,
      useValue: resources,
      multi: true
    },
    {
      provide: POTION_CONFIG,
      useValue: {
        prefix: '/api'
      }
    }
  ],
  entryComponents: [AppComponent]
})
export class AppModule {
  constructor(public upgrade: UpgradeModule) {}

  ngDoBootstrap() {}
}
