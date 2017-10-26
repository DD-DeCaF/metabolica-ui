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
  MatCardModule,
  MatMenuModule,
  MatAutocompleteModule,
  MatDialogModule
} from '@angular/material';


/**
 * https://material.angular.io/guide/getting-started#step-3-import-the-component-modules
 */
@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatSidenavModule, MatMenuModule, MatAutocompleteModule, MatDialogModule],
  exports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatSidenavModule, MatMenuModule, MatAutocompleteModule, MatDialogModule],
})
export class AppMaterialModule {
}
