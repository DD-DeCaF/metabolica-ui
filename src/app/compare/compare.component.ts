import {Component, ViewChild, ElementRef} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith, switchMap} from 'rxjs/operators';

import {Pool} from '../app.resources';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent {
  poolCtrl = new FormControl();
  queryResults: Observable<any[]>;
  selectedPools = [];
  noMatchesFound = false;

  @ViewChild('poolInput') poolInput: ElementRef;

  constructor() {
    this.queryResults = this.poolCtrl.valueChanges.pipe(
      startWith(null),
      switchMap(searchText => {
        this.noMatchesFound = false;
        if (searchText && searchText.length > 1) {
          return Pool.query({
            where: {
              project: 2,
              identifier: {
                $icontains: searchText
              }
            }
          }).then(pools => {
              const filteredPools = pools.filter(pool => !this.selectedPools.includes(pool));
              if (filteredPools.length) {
                return filteredPools;
              } else {
                this.noMatchesFound = true;
                return [];
              }
            },
            () => {
              this.noMatchesFound = true;
              return [];
            });
        }
        return Observable.of([]);
      })
    );
  }

  remove(pool: Pool): void {
    const index = this.selectedPools.indexOf(pool);
    if (index >= 0) {
      this.selectedPools.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedPools.push(event.option.value);
    this.poolInput.nativeElement.value = '';
  }
}
