import { Component, OnInit, Input } from '@angular/core';
import {MatSidenav} from "@angular/material";

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.css']
})
export class AppToolbarComponent implements OnInit {
  isAuthenticated: boolean;
  @Input() private sidenav: MatSidenav;

  constructor() {
    this.isAuthenticated = false;
  }

  ngOnInit() {
  }

}
