import {NgModule} from '@angular/core';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule
} from '@angular/material';


/**
 * https://material.angular.io/guide/getting-started#step-3-import-the-component-modules
 */
@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatSidenavModule],
  exports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatSidenavModule],
})
export class AppMaterialModule {
}
