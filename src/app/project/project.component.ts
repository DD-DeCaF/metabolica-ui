import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-project',
  template: `<p> You are know browsing project {{project.name}}</p>`
})
export class ProjectComponent implements OnInit {
  project: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.project = this.route.snapshot.data['project'];
  }

}
