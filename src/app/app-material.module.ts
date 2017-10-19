import { NgModule } from '@angular/core';

import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule } from '@angular/material';

/**
 * https://material.angular.io/guide/getting-started#step-3-import-the-component-modules
 */
@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule],
  exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule],
})
export class MetabolicaMaterialModule {
}
