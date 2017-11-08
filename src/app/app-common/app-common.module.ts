import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {DateComponent} from './date.component';
import {AppMaterialModule} from '../app-material.module';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule
  ],
  declarations: [UserComponent, DateComponent],
  exports: [UserComponent, DateComponent]
})
export class AppCommonModule { }
