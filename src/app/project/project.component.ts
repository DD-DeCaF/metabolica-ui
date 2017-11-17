import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectContextService} from './project-context.service';

@Component({
  selector: 'app-project',
  template: `<p> You are now browsing project {{project.name}}</p>`
})
export class ProjectComponent {
  project: any;

  constructor(private route: ActivatedRoute, private projectContext: ProjectContextService) {
    this.route.params.subscribe(() => {
        this.project = this.route.snapshot.data['project'];
        this.projectContext.announceProjectChange(this.project);
      }
    );
  }
}
