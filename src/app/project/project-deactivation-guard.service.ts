import {Injectable} from '@angular/core';
import {ProjectComponent} from './project.component';

import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {ProjectContextService} from './project-context.service';

@Injectable()
export class ProjectDeactivationGuardService implements CanDeactivate<ProjectComponent> {

  constructor(private projectContext: ProjectContextService) {
  }

  canDeactivate(component: ProjectComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.projectContext.announceProjectChange(null);
    return true;
  }

}
