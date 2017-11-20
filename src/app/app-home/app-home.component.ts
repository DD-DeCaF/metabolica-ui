import {Component, OnInit} from '@angular/core';

import {Project} from '../app.resources';
import {ProjectContextService} from '../project/project-context.service';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss']
})
export class AppHomeComponent implements OnInit {
  title = 'app';

  fetchingData = false;

  projects: any[] = [];
  project: any = null;

  constructor(private projectContext: ProjectContextService) {
    this.projectContext.projectChangeAnnounced.subscribe(project => this.project = project);
  }

  ngOnInit() {
    this.fetchingData = true;
    Project.query().then(projects => {
      this.projects = projects;
      this.fetchingData = false;
    });
  }

}
