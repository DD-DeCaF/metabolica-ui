import {Directive, ElementRef, Injector, Input} from '@angular/core';
import {UpgradeComponent} from '@angular/upgrade/static';
import {Ng1AppModule} from '../app-ng1.module';

// Wrapper for lineage-plot (the component is not directly upgradable)
// see: https://github.com/angular/angular/issues/6715
const LineagePlotWrapperComponent = {
  bindings: {
    plotData: '<',
    plotLayout: '<'
  },
  template: `{{$ctrl.plotData[0].name}}
             <lineage-plot plot-data="$ctrl.plotData" 
                           plot-layout="$ctrl.plotLayout">
             </lineage-plot>`
};


Ng1AppModule.component('ng1LineagePlot', LineagePlotWrapperComponent);


// Upgrade the angularJS component to be used in angular
// usage: <lineage-plot-ng2 [plotData]="..." [plotLayout]="..."></lineage-plot-ng2>
@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'lineage-plot-ng2'
})
export class LineagePlotDirective extends UpgradeComponent {
  @Input() plotData: any;
  @Input() plotLayout: any;

  constructor(elementRef: ElementRef, injector: Injector) {
    super('ng1LineagePlot', elementRef, injector);
  }
}

