import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpModule} from '@angular/http';
import {Ng2Webstorage} from 'ngx-webstorage';

import {AppMaterialModule} from './app-material.module';
import {AppRoutingModule} from './app-routing.module';
import {SessionModule} from './session/session.module';
import {SearchModule} from "./search/search.module";
import {RegistryModule} from "./registry/registry.module";


import {AppAuthService} from './app-auth.service';

import {AppComponent} from './app.component';
import {AppToolbarComponent} from './app-toolbar/app-toolbar.component';
import {AppHomeComponent} from "./app-home/app-home.component";


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
    Ng2Webstorage,
    AppRoutingModule,
    AppMaterialModule,
    SessionModule,
    SearchModule,
    RegistryModule
  ],
  providers: [AppAuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
