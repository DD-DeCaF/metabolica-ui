import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {MatSort} from '@angular/material';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {Medium} from '../app.resources';
import {ChemicalEntity} from '../app.resources';


interface Ingredient {
  compound: ChemicalEntity;
  concentration: number;
}

class IngredientsDataSource extends DataSource<Ingredient> {
  constructor(private ingredients: Ingredient[]) {
    super();
  }

  connect(): Observable<Ingredient[]> {
    return Observable.of(this.ingredients);
  }

  disconnect() {}
}


@Component({
  selector: 'app-medium',
  templateUrl: './medium.component.html',
  styleUrls: ['./medium.component.css']
})
export class MediumComponent implements OnInit {
  dataSource: IngredientsDataSource | null;
  displayedColumns = ['compound', 'concentration', 'chebi'];
  medium: any = null;

  @ViewChild(MatSort) sort: MatSort;

  constructor(route: ActivatedRoute) {
    route.params.subscribe(params => {
      const mediumId = params['mediumId'];
      Medium.fetch(mediumId).then(medium => {
        this.medium = medium;
        this.medium.readContents().then(ingredients => {
          this.dataSource = new IngredientsDataSource(ingredients);
        });
      });
    });
  }

  ngOnInit() {
    // todo: sorting
  }

}
