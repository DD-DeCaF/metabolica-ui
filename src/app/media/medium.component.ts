import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-medium',
  templateUrl: './medium.component.html',
  styleUrls: ['./medium.component.css']
})
export class MediumComponent implements OnInit {
  mediumId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.mediumId = this.route.snapshot.paramMap.get('mediumId');
    console.log(this.mediumId)
  }

}
