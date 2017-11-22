import {Component, DoCheck, Input, IterableDiffers} from '@angular/core';
import {Pool} from '../../app.resources';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';


class GenotypeChangesDataSource extends DataSource<any> {
  columnNames = [];
  changes = [];
  poolIdentifiers = [];

  constructor(comparison: any) {
    super();
    if (comparison && comparison.pools) {
      this.changes = comparison.changes;
      this.poolIdentifiers = comparison.pools.map(pool => pool.pool.identifier);

      for (const change of this.changes) {
        for (const pool of comparison.pools) {
          change[pool.pool.identifier] = pool.changes.includes(change.gnomic) ? '\u2714' : '';
        }
      }

      this.columnNames = ['change'].concat(this.poolIdentifiers);
    }
  }

  connect(): Observable<any[]> {
    return Observable.of(this.changes);
  }

  disconnect() {}

}

@Component({
  selector: 'app-compare-genotypes',
  templateUrl: './compare-genotypes.component.html',
  styleUrls: ['./compare-genotypes.component.css']
})
export class CompareGenotypesComponent implements DoCheck {
  dataSource?: GenotypeChangesDataSource = null;
  includeCommonChanges = true;
  iterableDiffer: any;

  @Input() pools = [];

  constructor(iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngDoCheck() {
    if (this.iterableDiffer.diff(this.pools)) {
      this.updateComparison();
    }
  }

  updateComparison() {
    if (this.pools.length) {
      Pool.compareGenotypes({
        pools: this.pools,
        include_common: this.includeCommonChanges
      }).then(comparison => this.dataSource = new GenotypeChangesDataSource(comparison))
        .catch(() => this.dataSource = null);
    } else {
      this.dataSource = null;
    }
  }

}
