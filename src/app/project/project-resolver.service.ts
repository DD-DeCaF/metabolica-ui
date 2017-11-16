import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';

import {Project} from '../app.resources';

@Injectable()
export class ProjectResolverService implements Resolve<any> {

  constructor(private router: Router) { }

  resolve(route: ActivatedRouteSnapshot) {
    const projectId = route.paramMap.get('project');

    return Project.fetch(projectId)
      .catch(() => {
        this.router.navigate(['/app/home']);
      });
  }

}
