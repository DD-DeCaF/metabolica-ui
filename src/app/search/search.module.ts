import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { SearchSourcesProvider} from "./search-source.service";
import {AppMaterialModule} from "../app-material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    FormsModule
  ],
  exports: [SearchComponent],
  declarations: [SearchComponent],
  providers: [SearchSourcesProvider]
})
export class SearchModule { }
