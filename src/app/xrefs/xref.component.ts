import { Component, OnChanges, Input } from '@angular/core';
import {RegistryService} from "../registry/registry.service";

@Component({
  selector: 'app-xref',
  template: `<a matLine [queryParams]="stateParams" [routerLink]="state">{{ text }}</a>`
})
export class XrefComponent implements OnChanges {
  xrefs: any;
  state: string = '';
  stateParams: Object = {};
  text: string = '';
  @Input() type: string;
  @Input() value: any;

  constructor(registry: RegistryService) {
    // register for test purposes
    registry.register('Experiment', ['xref'], {
      controller: {},
      template: `experiment xref menu for {{experiment.identifier}}`,
      state: (experiment) => 'app.project.experiment',
      stateParams: (experiment) => ({experimentId: experiment.id}),
      locals: (experiment) => ({experiment}),
      formatAsText: (experiment) => experiment.identifier
    });

    this.xrefs = registry.get('xref');
  }

  ngOnChanges() {
    if (this.value) {
      const config = this.xrefs[this.type || this.value.constructor.name];
      if (config) {
        this.state = config.state(this.value);
        this.stateParams = config.stateParams(this.value);
        this.text = config.formatAsText(this.value);
      }
    }
  }

}
