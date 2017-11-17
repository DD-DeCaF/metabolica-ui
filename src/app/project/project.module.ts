import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectComponent} from './project.component';
import {ProjectContextService} from './project-context.service';
import {ProjectDeactivationGuardService} from './project-deactivation-guard.service';
import {ProjectResolverService} from './project-resolver.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ProjectComponent],
  providers: [ProjectContextService, ProjectDeactivationGuardService, ProjectResolverService]
})
export class ProjectModule {
}
