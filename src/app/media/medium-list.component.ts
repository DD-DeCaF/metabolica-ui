import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-medium-list',
  templateUrl: './medium-list.component.html',
  styleUrls: ['./medium-list.component.css']
})
export class MediumListComponent implements OnInit {
  page: number;
  perPage: number;
  order: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] || 1;
      this.perPage = params['per_page'] || 20;
      this.order = params['order'] || 'createdAt';
    });
  }

}
