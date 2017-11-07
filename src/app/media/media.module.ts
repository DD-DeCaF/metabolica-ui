import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediumComponent } from './medium.component';
import { MediumListComponent } from './medium-list.component';
import {RegistryService} from '../registry/registry.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MediumComponent, MediumListComponent]
})
export class MediaModule {

  constructor(registry: RegistryService) {

    registry.register('Medium',
      ['search'],
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
