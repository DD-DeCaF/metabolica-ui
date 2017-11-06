import {Component, OnInit} from '@angular/core';
import {ClipboardService} from "./clipboard.service";
import {SharingService} from "../sharing/sharing.service";
import {OverlayRef} from "@angular/cdk/overlay";
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  templateUrl: './clipboard-menu-panel.component.html',
  styleUrls: ['./clipboard-menu-panel.component.css']
})
export class ClipboardMenuPanelComponent implements OnInit {
  itemGroups: [string, object[]][];
  sharingTargets: Array<any>;
  private overlayRef: OverlayRef;

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private clipboard: ClipboardService, private sharing: SharingService) {
    iconRegistry
      .addSvgIcon('share', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/share.svg'))
      .addSvgIcon('clear-all', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/clear-all.svg'))
      .addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/delete.svg'));


    this.itemGroups = [];
    this.sharingTargets = [];

    for (const [type, items] of Object.entries(this.clipboard.getItemsGroupedByType())) {
      this.itemGroups.push([type, items.map(value => ({
        value,
        selected: true,
        sharingTargets: this.sharing.findTargets(type)
      }))]);
    }

    console.log(this.itemGroups);

    this.onSelectionChange();
  }

  onSelectionChange() {
    this.sharingTargets = this.getSharingTargets();
  }

  getSharingTargets() {
    const selectedItemGroups = this.getSelectedItemGroups();
    console.log(selectedItemGroups);

    return this.sharing.registry.filter(({_name, accept}) =>
      accept.some(({type, multiple}) => selectedItemGroups[type] !== undefined && (multiple || !(selectedItemGroups[type].length > 1))
      ));
  }

  open(state) {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }

    const selectedItemGroups: object = this.getSelectedItemGroups();
    const provided = {};

    for (const [type, items] of Object.entries(selectedItemGroups)) {
      if (items.length === 1) {
        provided[type] = items[0].value;
      } else {
        provided[type] = items.map(item => item.value);
      }
    }

    this.sharing.provide(provided);
    this.sharing.open(state);
  }

  shareWith(type, value, state) {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
    this.sharing.share(type, value, state);
  }

  remove(type, value) {
    this.clipboard.remove(type, value);
    // this.itemGroups[type] = this.itemGroups[type].filter(item => item.value.$uri !== value.$uri);
    this.onSelectionChange();

    if (this.clipboard.isEmpty()) {
      if (this.overlayRef) {
        this.overlayRef.dispose();
      }
    }
  }

  clear() {
    this.clipboard.clear();
    this.itemGroups = [];
    this.onSelectionChange();

    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  getTypePluralName(type) {
    const config = this.clipboard.registry[type];
    if (config) {
      return config.pluralName;
    }
    return `${type}s`;
  }

  getSelectedItemGroups() {
    return this.itemGroups
      .map(([type, items]: [string, any]) => [type, items.filter((item: any) => item.selected)])
      .filter(([, items]) => items.length > 0)
      .reduce((result: any, [type, items]: [string, any]) => {
        result[type] = items;
        return result;
      }, {});
  }

  ngOnInit() {
  }

}
