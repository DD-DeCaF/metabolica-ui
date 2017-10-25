import {Component} from '@angular/core';
import {SearchSourcesProvider} from "./search-source.service";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  showSearch: boolean = false;
  searchText: string = '';
  placeholder: string = 'Search';
  searchSources: Array<any>;

  constructor(sourceProvider: SearchSourcesProvider) {
    this.searchSources = sourceProvider.getSources();
    this.placeholder = `Search ${this.searchSources.map(source => source.source.pluralName).join(', ')}`;
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.searchText = '';
  }

  query() {
    if (this.searchText && this.searchText.length > 1) {
      let searches = [];
      for (const {resource, source} of this.searchSources) {
        searches.push(source.query(resource, this.searchText)
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
        .then(searches => searches
          .reduce((a, b) => a.concat(b))
          .sort((a, b) => a.text.localeCompare(b.text))
        );
    }
  }

  onItemSelection(item: any) {
    console.log(item);
    if (item) {
      this.searchText = '';
      this.showSearch = false;
      // to do: redirect to url (using item.state, item.stateParam)
    }
  }
}
