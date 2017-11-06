import {Component, OnInit, ViewChild} from '@angular/core';
import {Overlay, OverlayOrigin, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from "@angular/cdk/portal";
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {ClipboardMenuPanelComponent} from "./clipboard-menu-panel.component";
import {ClipboardService} from "./clipboard.service";

@Component({
  selector: 'clipboard-menu',
  template: `
    <span [hidden]="clipboard.isEmpty()">
    <button mat-icon-button id="clipboard-menu"
            aria-label="Clipboard"
            cdk-overlay-origin
            (click)="showClipboardPanel()">
      <mat-icon svgIcon="clipboard-outline"></mat-icon>
    </button>
  </span>`
})
export class ClipboardMenuComponent implements OnInit {
  @ViewChild(OverlayOrigin) overlayOrigin: OverlayOrigin;
  component: any = null;
  overlayRef: OverlayRef = null;

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private overlay: Overlay, public clipboard: ClipboardService) {
    iconRegistry
      .addSvgIcon('clipboard-outline', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/clipboard-outline.svg'));

    clipboard.onChange(() => {
      if (clipboard.isEmpty() && this.overlayRef) {
        this.overlayRef.detach(); // removes the component
        this.overlayRef.dispose(); // removes the overlay panel
      }
    });
  }

  ngOnInit() {
  }

  showClipboardPanel() {
    this.overlayRef = this.overlay.create({
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      // panelClass: 'xref-menu-overlay-panel', // has to be defined in styles.css (main css file)
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position()
        .connectedTo(
          this.overlayOrigin.elementRef,
          {originX: 'center', originY: 'bottom'}, {overlayX: 'start', overlayY: 'top'})
        .withFallbackPosition(
          {originX: 'center', originY: 'top'}, {overlayX: 'start', overlayY: 'bottom'}
        )
        .withFallbackPosition(
          {originX: 'center', originY: 'bottom'}, {overlayX: 'end', overlayY: 'top'}
        )
        .withFallbackPosition(
          {originX: 'center', originY: 'top'}, {overlayX: 'end', overlayY: 'bottom'}
        )
    });

    this.overlayRef.attach(new ComponentPortal(ClipboardMenuPanelComponent));
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach(); // removes the component
      this.overlayRef.dispose(); // removes the overlay panel
    });
  }
}


