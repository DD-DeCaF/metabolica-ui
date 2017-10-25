import {Injectable} from '@angular/core';


interface Source {
  name: string;
  pluralName: string;
  state: string;
  query(resource: any, searchText: string): Promise<any>;
  stateParams(item: any): object;
  formatAsText(item: any): string;
}

interface Sources {
  [key: string]: Source
}


@Injectable()
export class SearchSourcesProvider {
  sources: Sources = {};

  constructor() {
    this.register('testElement', {
        name: 'testElement',
        pluralName: 'testElements',
        state: 'home',
        query: (resource, searchText) => {
          return new Promise((resolve, reject) => {
            resolve(['elementA', 'elementB', 'otherElement']
              .filter(x => x.startsWith(searchText)))
          });
        },
        stateParams: (item) => ({item}),
        formatAsText: (item) => `${item}_formatted`
      })
  }

  register(name: string, source: Source) {
    this.sources[name] = source;
  }

  getSources() {
    return Object.keys(this.sources)
      .map(resourceName => ({
        source: this.sources[resourceName],
        resource: resourceName
      }));
  }
}
