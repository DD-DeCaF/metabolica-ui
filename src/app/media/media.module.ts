import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediumComponent } from './medium.component';
import { MediumListComponent } from './medium-list.component';
import {RegistryService} from '../registry/registry.service';
import {AppMaterialModule} from '../app-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {XrefsModule} from '../xrefs/xrefs.module';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    XrefsModule
  ],
  declarations: [MediumComponent, MediumListComponent]
})
export class MediaModule {

  constructor(registry: RegistryService) {

    registry.register('Medium',
      ['xref'],
      {
        name: 'medium',
        pluralName: 'media',
        route: '/home/media',
        query: searchText => searchText, // todo: query medium
        stateParams: medium => ({mediumId: medium.id}),
        formatAsText: medium => medium.name
      });
  }
}
