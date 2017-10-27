import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from "@angular/cdk/overlay";

import {XrefComponent} from './xref.component';
import {RegistryService} from "../registry/registry.service";
import {AppMaterialModule} from "../app-material.module";
import {AppRoutingModule} from "../app-routing.module";
import {XrefMenuComponent, TestPanel} from './xref-menu.component';


@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    AppMaterialModule,
    OverlayModule,
  ],
  exports: [XrefComponent, XrefMenuComponent],
  declarations: [XrefComponent, XrefMenuComponent, TestPanel],
  providers: [RegistryService],
  entryComponents: [TestPanel]
})
export class XrefsModule {
}

