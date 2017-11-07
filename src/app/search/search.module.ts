import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search.component';
import {AppMaterialModule} from '../app-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {RegistryService} from '../registry/registry.service';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    FormsModule
  ],
  exports: [SearchComponent],
  declarations: [SearchComponent],
  providers: [RegistryService]
})
export class SearchModule {
  constructor(private registry: RegistryService) {
    // register fake resource for testing purpose
    registry.register('experiment', ['search', 'clipboard', 'sharing'], {
      type: 'experiment',
      name: 'Experiment',
      accept: [{type: 'experiment', multiple: true}],
      resourceName: 'testElement',
      pluralName: 'testElements',
      state: 'home',
      query: (resource, searchText) => {
        return new Promise((resolve, reject) => {
          resolve(['elementA', 'elementB', 'otherElement']
            .filter(x => x.startsWith(searchText)));
        });
      },
      stateParams: item => ({item}),
      formatAsText: item => `${item}_formatted`
    });
  }
}
