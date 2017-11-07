import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {HttpClient} from '@angular/common/http';


export interface Medium {
  name: string;
  key: string;
  createdBy: string;
  createdAt: string;
}


@Component({
  selector: 'app-medium-list',
  templateUrl: './medium-list.component.html',
  styleUrls: ['./medium-list.component.css']
})
export class MediumListComponent implements OnInit {
  page: number;
  perPage: number;
  order: string;
  dataSource: MediumDataSource;
  displayedColumns = ['name'];

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] || 1;
      this.perPage = params['per_page'] || 20;
      this.order = params['order'] || 'createdAt';
    });
    this.dataSource = new MediumDataSource(this.http);

  }

}

class MediumDataSource extends DataSource<Medium> {
  constructor(private http: HttpClient) {
    super();
  }

  connect(): Observable<Medium[]> {
    return this.http.get('/api/medium');
  }

  disconnect() {}
}
