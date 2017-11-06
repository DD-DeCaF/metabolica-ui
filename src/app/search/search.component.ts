import {Component} from '@angular/core';
import {RegistryService} from '../registry/registry.service';


interface Source {
  resourceName: string;
  pluralName: string;
  state: string;
  query(resource: any, searchText: string): Promise<any>;
  stateParams(item: any): {[key: string]: any};
  formatAsText(item: any): string;
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  showSearch = false;
  searchText = '';
  placeholder = 'Search';
  searchSources: Array<Source>;

  constructor(registry: RegistryService) {
    // register fake resource for testing purpose
    registry.register('experiment', ['search'], {
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

    this.searchSources = Object.values(registry.get('search'));
    this.placeholder = `Search ${this.searchSources.map(source => source.pluralName).join(', ')}`;
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.searchText = '';
  }

  query() {
    if (this.searchText && this.searchText.length > 1) {
      const searches = [];
      for (const source of this.searchSources) {
        searches.push(source.query(source.resourceName, this.searchText)
          .then(results =>
            results.map(result => ({
              source,
              state: source.state,
              stateParams: source.stateParams(result),
              text: source.formatAsText(result)
            }))
          )
          .catch(() => [])
        );
      }

      return Promise.all(searches)
        .then(results => results
          .reduce((a, b) => a.concat(b))
          .sort((a, b) => a.text.localeCompare(b.text))
        );
    }
  }

  onItemSelection(item: any) {
    if (item) {
      this.searchText = '';
      this.showSearch = false;
      // to do: redirect to url (using item.state, item.stateParam)
    }
  }
}
