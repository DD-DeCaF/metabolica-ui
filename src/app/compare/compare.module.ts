import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppMaterialModule} from '../app-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { CompareComponent } from './compare.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule
  ],
  declarations: [CompareComponent]
})
export class CompareModule {
}
