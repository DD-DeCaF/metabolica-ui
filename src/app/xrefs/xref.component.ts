import { Component, OnChanges, Input } from '@angular/core';
import {RegistryService} from '../registry/registry.service';

@Component({
  selector: 'app-xref',
  template: `<a [queryParams]="stateParams" [routerLink]="state">{{ text }}</a>`,
  styles: ['a {text-decoration: none;}']
})
export class XrefComponent implements OnChanges {
  xrefs: any;
  state = '';
  stateParams: {[key: string]: any};
  text = '';
  @Input() type: string;
  @Input() value: any;

  constructor(registry: RegistryService) {
    this.xrefs = registry.get('xref');
  }

  ngOnChanges() {
    if (this.value) {
      const config = this.xrefs[this.type || this.value.constructor.name];
      if (config) {
        this.state = config.state;
        this.stateParams = config.stateParams(this.value);
        this.text = config.formatAsText(this.value);
      }
    }
  }

}
