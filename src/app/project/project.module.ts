import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectComponent} from './project.component';
import {ProjectResolverService} from './project-resolver.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ProjectComponent],
  providers: [ProjectResolverService]
})
export class ProjectModule { }
