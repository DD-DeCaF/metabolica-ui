import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';

import {XrefComponent} from './xref.component';
import {RegistryService} from '../registry/registry.service';
import {AppMaterialModule} from '../app-material.module';
import {AppRoutingModule} from '../app-routing.module';
import {XrefMenuComponent, TestPanelComponent} from './xref-menu.component';


@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    AppMaterialModule,
    OverlayModule,
  ],
  exports: [XrefComponent, XrefMenuComponent],
  declarations: [XrefComponent, XrefMenuComponent, TestPanelComponent],
  providers: [RegistryService],
  entryComponents: [TestPanelComponent]
})
export class XrefsModule {
}
