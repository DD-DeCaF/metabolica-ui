import {Component, OnInit, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {MatPaginator, MatSort} from '@angular/material';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';

import {Medium} from '../app.resources';


class MediumDataSource extends DataSource<Medium> {
  resultsLength = 119; // {paginate: true} doesn't work, so we can't get the total length from the query

  constructor(private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  connect(): Observable<Medium[]> {
    const displayDataChanges = [
      this.sort.sortChange,
      this.paginator.page
    ];

    // reset to first page when the sort order is changed
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    return Observable.merge(...displayDataChanges)
      .startWith(null)
      .switchMap(() => Medium.query(
        {
          page: this.paginator.pageIndex + 1,
          perPage: this.paginator.pageSize,
          sort: getSortValue(this.sort.active, this.sort.direction)
        },
        {
          cache: true,
          paginate: false
        }))
      .catch(() => Observable.of([]));
  }

  disconnect() {}
}

@Component({
  selector: 'app-medium-list',
  templateUrl: './medium-list.component.html',
  styleUrls: ['./medium-list.component.css']
})
export class MediumListComponent implements OnInit {
  pageSize = 10;
  defaultSort = 'createdAt';
  dataSource: MediumDataSource;
  displayedColumns = ['name', 'identifier', 'createdBy', 'createdAt'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource = new MediumDataSource(this.paginator, this.sort);
  }

}

function getSortValue(activeSort: string, direction: string): {[key: string]: boolean} {
  if (activeSort) {
    if (direction === 'asc') {
      return {[activeSort]: false};
    } else if (direction === 'desc') {
      return {[activeSort]: true};
    }
  }
  return {};
}
