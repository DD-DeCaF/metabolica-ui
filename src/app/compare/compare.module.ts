import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppMaterialModule} from '../app-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CompareComponent} from './compare.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CompareGenotypesComponent} from './compare-genotypes/compare-genotypes.component';
import { ExperimentHistoryComponent } from './experiment-history/experiment-history.component';
import {AppCommonModule} from '../app-common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppCommonModule
  ],
  declarations: [CompareComponent, CompareGenotypesComponent, ExperimentHistoryComponent]
})
export class CompareModule {
}
