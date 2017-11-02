import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {RegistryService} from "../registry/registry.service";

@Injectable()
export class SharingService {
  private provided = {};
  private transfer = {};
  private hooks = [];

  constructor(private router: Router, private _registry: RegistryService) {
  }

  get registry(): Array<any> {
    return Object.values(this._registry.get('sharing')).filter(({accept = null}) => accept);
  }

  items(type: string, otherwise: Array<any> = []) {
    let values = this.transfer[type];
    if (values instanceof Array) {
      delete this.transfer[type];
      return values;
    } else if (values !== undefined) {
      delete this.transfer[type];
      return [values];
    } else {
      return otherwise;
    }
  }

  item(type: string, otherwise: any = null) {
    let value = this.transfer[type];
    if (!(value === undefined || value instanceof Array)) {
      delete this.transfer[type];
      return value;
    } else {
      return otherwise;
    }
  }

  provide(shareable) {
    this.provided = Object.assign({}, this.provided, shareable);
    this._triggerOnShareChange();
  }

  clearProvisions() {
    this.provided = {};
    this._triggerOnShareChange();
  }

  onShareChange(hookFn) {
    this.hooks.push(hookFn);
  }

  _triggerOnShareChange() {
    let targets = this.targets;
    for (let hookFn of this.hooks) {
      hookFn(targets);
    }
  }

  get targets() {
    return this.registry.filter(({_name, accept}) =>
      accept.some(({type, multiple}) => this.provided[type] !== undefined && (multiple || !(this.provided[type] instanceof Array))));
  }

  findTargets(provides, isMultiple = false) {
    return this.registry.filter(({_name, accept, state}) => accept.some(({type, multiple}) => type === provides && (multiple || !isMultiple)));
  }

  open(state) {
    this.transfer = this.provided;
    this.router.navigate([state])
  }

  share(type, itemOrItems, targetState) {
    this.provided = {[type]: itemOrItems};
    this.open(targetState);
  }
}
