import {Injectable} from '@angular/core';
import {RegistryService} from '../registry/registry.service';


@Injectable()
export class ClipboardService {
  items: [string, any][] = [];
  hooks: any;

  constructor(private _registry: RegistryService) {
    this.items = [];
    this.hooks = new Set();
  }

  get registry(): object {
    return this._registry.get('clipboard');
  }

  isEmpty() {
    return this.items.length === 0;
  }

  canAdd(type): boolean {
    return this.registry[type] !== undefined;
  }

  clear(): void {
    const oldItemsCount = this.items.length;
    this.items = [];

    if (oldItemsCount > 0) {
      this._triggerOnChange();
    }
  }

  add(type: string, value: any): void {
    this.items.push([type, value]);
    this._triggerOnChange();
  }

  remove(type, value): void {
    const oldItemsCount = this.items.length;
    this.items = this.items.filter(([itemType, itemValue]) => !(itemType === type && itemValue.$uri === value.$uri));

    if (this.items.length < oldItemsCount) {
      this._triggerOnChange();
    }
  }

  onChange(hookFn): void {
    this.hooks.add(hookFn);
  }

  offChange(hookFn): void {
    this.hooks.delete(hookFn);
  }

  _triggerOnChange(): void {
    this.hooks.forEach(hookFn => hookFn());
  }

  getItemsOfType(type): [string, any][] {
    return this.items.filter(([itemType, ]) => itemType === type);
  }

  getItemsGroupedByType(): object {
    const itemGroups = {};
    for (const [type, value] of this.items) {
      if (!itemGroups[type]) {
        itemGroups[type] = [value];
      } else {
        itemGroups[type].push(value);
      }
    }
    return itemGroups;
  }

}
