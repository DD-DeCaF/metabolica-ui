import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {ClipboardService} from "./clipboard.service";


@Component({
  selector: 'add-to-clipboard',
  template: `
    <button mat-icon-button button [disabled]="isAdded"
            (click)="addToClipboard(type, value)">
      <span [hidden]="isAdded"><mat-icon svgIcon="clipboard-plus"></mat-icon></span>
      <span [hidden]="!isAdded"><mat-icon svgIcon="clipboard-check"></mat-icon></span>
    </button>
  `
})
export class AddToClipboardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: string;
  @Input() value: any;
  isAdded: boolean;
  clipboardChangeHandler: any;


  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private clipboard: ClipboardService) {
    iconRegistry
      .addSvgIcon('clipboard-plus', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/clipboard-plus.svg'))
      .addSvgIcon('clipboard-check', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/clipboard-check.svg'));

    this.clipboardChangeHandler = () => this.checkIfAdded(this.type, this.value);

  }

  checkIfAdded(type, value) {
    const items = this.clipboard.getItemsOfType(type);
    this.isAdded = items.length > 0 && items.some(([, itemValue]) => itemValue.$uri === value.$uri);
  }

  addToClipboard(type, value) {
    if (!(type && value)) {
      return;
    }

    if (!this.clipboard.canAdd(type)) {
      return;
    }

    this.clipboard.add(type, value);
  }

  ngOnInit() {
    this.checkIfAdded(this.type, this.value);
    this.clipboard.onChange(this.clipboardChangeHandler);
  }

  ngOnChanges() {
    this.checkIfAdded(this.type, this.value);
  }

  ngOnDestroy() {
    this.clipboard.offChange(this.clipboardChangeHandler);
  }
}



