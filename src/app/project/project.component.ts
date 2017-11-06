import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-project',
  template: `<p> You are know browsing project {{projectId}}</p>`
})
export class ProjectComponent implements OnInit {
  projectId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('project');
  }

}
