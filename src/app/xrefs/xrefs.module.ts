import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {XrefComponent} from './xref.component';
import {RegistryService} from "../registry/registry.service";
import {AppMaterialModule} from "../app-material.module";
import {AppRoutingModule} from "../app-routing.module";
import {DialogComponent, XrefMenuComponent} from './xref-menu.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  exports: [XrefComponent, XrefMenuComponent],
  declarations: [XrefComponent, XrefMenuComponent, DialogComponent],
  providers: [RegistryService],
  entryComponents: [DialogComponent]
})
export class XrefsModule {
}
