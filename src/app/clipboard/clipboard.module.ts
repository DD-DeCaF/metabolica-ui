import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {AppMaterialModule} from '../app-material.module';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ClipboardService} from './clipboard.service';
import {AddToClipboardComponent} from './add-to-clipboard.component';
import {ClipboardMenuComponent} from './clipboard-menu.component';
import {ClipboardMenuPanelComponent} from './clipboard-menu-panel.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    OverlayModule,
    FormsModule,
    FlexLayoutModule
  ],
  exports: [AddToClipboardComponent, ClipboardMenuComponent],
  declarations: [AddToClipboardComponent, ClipboardMenuComponent, ClipboardMenuPanelComponent],
  providers: [ClipboardService],
  entryComponents: [ClipboardMenuPanelComponent]

})
export class ClipboardModule {
}
