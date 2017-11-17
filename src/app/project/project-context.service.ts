import {Injectable} from '@angular/core';

import {Subject} from 'rxjs/Subject';
import {Project} from '../app.resources';

@Injectable()
export class ProjectContextService {

  private projectChangedSource = new Subject<Project>();

  projectChangeAnnounced = this.projectChangedSource.asObservable();

  announceProjectChange(project: Project) {
    this.projectChangedSource.next(project);
  }
}
