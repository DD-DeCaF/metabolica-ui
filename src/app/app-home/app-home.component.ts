import {Component, OnInit} from '@angular/core';

import {Project} from "../app.resources";

import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent implements OnInit {
  title = 'app';

  fetchingData: boolean = false;

  projects: any[] = [];
  project: any=null;

  constructor(private route: ActivatedRoute, private router: Router) {
    router.events.subscribe(event=>{
      if (event instanceof  NavigationEnd){
        this.project = this.route.firstChild && this.route.firstChild.snapshot.data['project'];
      }
    })
  }

  ngOnInit() {
    this.fetchingData = true;
    Project.query().then(projects => {
      this.projects = projects;
      this.fetchingData = false;
    });
  }

}
