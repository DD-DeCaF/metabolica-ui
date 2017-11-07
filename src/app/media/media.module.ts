import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediumComponent } from './medium.component';
import { MediumListComponent } from './medium-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MediumComponent, MediumListComponent]
})
export class MediaModule { }
