import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MediumComponent} from './medium.component';
import {MediumListComponent} from './medium-list.component';
import {RegistryService} from '../registry/registry.service';
import {AppMaterialModule} from '../app-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {XrefsModule} from '../xrefs/xrefs.module';
import {Medium} from '../app.resources';
import {AppCommonModule} from '../app-common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    XrefsModule,
    AppCommonModule
  ],
  declarations: [MediumComponent, MediumListComponent]
})
export class MediaModule {

  constructor(registry: RegistryService) {

    registry.register('Medium',
      ['xref', 'search'],
      {
        name: 'medium',
        pluralName: 'media',
        getRouterLink: medium => ['/home/medium', medium.id],
        query: searchText => Medium.query({where: {identifier: {$icontains: searchText}}}),
        getQueryParams: medium => ({}),
        formatAsText: medium => medium.name
      });
  }
}
