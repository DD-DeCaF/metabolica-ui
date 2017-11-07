import {Component, OnChanges, Input, ViewChild} from '@angular/core';
import {Overlay, OverlayOrigin} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {RegistryService} from '../registry/registry.service';

@Component({
  selector: 'app-test-panel',
  template: `<div> xref menu content </div>`
})
export class TestPanelComponent { }


@Component({
  selector: 'app-xref-menu',
  templateUrl: './xref-menu.component.html',
  styleUrls: ['./xref-menu.component.css']
})
export class XrefMenuComponent implements OnChanges {
  component: any = null;
  text = '';
  xrefs: any;
  @Input() type: string;
  @Input() value: any;
  @ViewChild(OverlayOrigin) overlayOrigin: OverlayOrigin;

  constructor(public overlay: Overlay, registry: RegistryService) {


    this.xrefs = registry.get('xref');
  }

  ngOnChanges() {
    if (this.value) {
      const config = this.xrefs[this.type || this.value.constructor.name];
      if (config) {
        this.text = config.formatAsText(this.value);
        this.component = config.component;
      }
    }
  }

  openPanel() {
    if (this.value && this.component) {
      const overlayRef = this.overlay.create({
        backdropClass: 'cdk-overlay-transparent-backdrop',
        hasBackdrop: true,
        panelClass: 'xref-menu-overlay-panel', // has to be defined in styles.css (main css file)
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

      overlayRef.attach(new ComponentPortal(this.component));
      overlayRef.backdropClick().subscribe(() => {
        overlayRef.detach(); // removes the component
        overlayRef.dispose(); // removes the overlay panel
      });
    }
  }
}
