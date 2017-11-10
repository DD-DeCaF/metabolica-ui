import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {MatSort} from '@angular/material';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';

import {Medium} from '../app.resources';
import {ChemicalEntity} from '../app.resources';


interface Ingredient {
  compound: ChemicalEntity;
  concentration: number;
}

class IngredientsDataSource extends DataSource<Ingredient> {
  data: any;

  constructor(private ingredients: any, private sort: MatSort) {
    super();
  }

  connect(): Observable<Ingredient[]> {
    return this.sort.sortChange
      .startWith(null)
      .map(() => this.getSortedData());
  }

  getSortedData(): Ingredient[] {
    if (!this.sort.active || this.sort.direction === '')  {
      return this.ingredients;
    }
    return this.ingredients.sort((a, b) => {
      let propertyA: number | string;
      let propertyB: number | string;
      switch (this.sort.active) {
        case 'compound': [propertyA, propertyB] = [a.compound.name, b.compound.name]; break;
        case 'concentration': [propertyA, propertyB] = [a.concentration, b.concentration]; break;
        case 'chebi': [propertyA, propertyB] = [a.compound.chebiId, b.compound.chebiId]; break;
      }
      return (propertyA < propertyB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
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
  isLoadingIngredients = false;
  medium: any = null;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const mediumId = params['mediumId'];
      Medium.fetch(mediumId).then(medium => {
        this.isLoadingIngredients = true;
        this.medium = medium;
        this.medium.readContents()
          .then(ingredients => {
            this.dataSource = new IngredientsDataSource(ingredients, this.sort);
            this.isLoadingIngredients = false;
          });
      });
    });
  }

}
