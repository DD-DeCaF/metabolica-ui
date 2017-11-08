import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-medium',
  templateUrl: './medium.component.html',
  styleUrls: ['./medium.component.css']
})
export class MediumComponent implements OnInit {
  mediumId: string;

  constructor(route: ActivatedRoute) {
    route.params.subscribe(params => this.mediumId = params['mediumId']);
  }

  ngOnInit() { }

}
