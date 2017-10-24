import { NgModule } from '@angular/core';

import { MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule,
  MatFormFieldModule, MatInputModule, MatCardModule } from '@angular/material';

/**
 * https://material.angular.io/guide/getting-started#step-3-import-the-component-modules
 */
@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatCardModule],
  exports: [MatButtonModule, MatCheckboxModule, MatListModule, MatToolbarModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatCardModule],
})
export class AppMaterialModule {
}
