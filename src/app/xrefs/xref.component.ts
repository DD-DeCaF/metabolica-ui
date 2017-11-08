import { Component, OnChanges, Input } from '@angular/core';
import {RegistryService} from '../registry/registry.service';

@Component({
  selector: 'app-xref',
  template: `<a [queryParams]="queryParams" [routerLink]="routerLink">{{ text }}</a>`,
  styles: ['a {text-decoration: none;}']
})
export class XrefComponent implements OnChanges {
  routerLink: Array<string|number> | string | number;
  queryParams: {[key: string]: any};
  text = '';
  xrefs: {[key: string]: any};

  @Input() type: string;
  @Input() value: any;

  constructor(registry: RegistryService) {
    this.xrefs = registry.get('xref');
  }

  ngOnChanges() {
    if (this.value) {
      const config = this.xrefs[this.type || this.value.constructor.name];
      if (config) {
        this.routerLink = config.getRouterLink(this.value);
        this.queryParams = config.getQueryParams(this.value);
        this.text = config.formatAsText(this.value);
      }
    }
  }

}
