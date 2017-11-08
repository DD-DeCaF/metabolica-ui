import {NgModule} from '@angular/core';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule
} from '@angular/material';


/**
 * https://material.angular.io/guide/getting-started#step-3-import-the-component-modules
 */
@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatSidenavModule, MatMenuModule, MatAutocompleteModule, MatDialogModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatProgressSpinnerModule],
  exports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatSidenavModule, MatMenuModule, MatAutocompleteModule, MatDialogModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatProgressSpinnerModule],
  providers: [MatIconRegistry]
})
export class AppMaterialModule {
}
