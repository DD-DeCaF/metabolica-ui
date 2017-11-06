import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {Ng2Webstorage} from 'ngx-webstorage';

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

@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    AppHomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpModule,
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
    ProjectModule
  ],
  providers: [AppAuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
