import {Component, OnChanges, Input} from '@angular/core';
import {Experiment} from '../../app.resources';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import 'rxjs/add/observable/forkJoin';


class ExperimentHistoryDataSource extends DataSource<any> {
  experiments = [];
  experimentIdToPools = {};

  constructor(private pools: Array<any>) {
    super();
  }

  connect(): Observable<any[]> {
    this.experiments = [];
    this.experimentIdToPools = {};

    const promises = [];

    for (const pool of this.pools) {
      promises.push(this.getPoolExperiments(pool));
      if (pool.parentPool) {
        promises.push(this.getPoolExperiments(pool.parentPool));
      }
    }

    return Observable.forkJoin(promises).pipe(
      map(() => this.experiments)
    );
  }

  disconnect() {}

  getPoolExperiments(pool) {
    return Experiment.containing({pool})
      .then((experiments: Array<Experiment>) => {
        for (const experiment of experiments) {
          if (!this.experiments.includes(experiment)) {
            this.experiments.push(experiment);
          }
          this.experimentIdToPools[experiment.id]
            ? this.experimentIdToPools[experiment.id].push(pool)
            : this.experimentIdToPools[experiment.id] = [pool];
        }
      });
  }

  getExperimentClosestOriginPool(experiment, pool) {
    for (let currentPool = pool; currentPool; currentPool = currentPool.parentPool) {
      if (this.experimentIdToPools[experiment.id].includes(currentPool)) {
        return currentPool.identifier;  // return currentPool; (once the pool xref is implemented)
      }
    }
    return null;
  }
}


@Component({
  selector: 'app-experiment-history',
  templateUrl: './experiment-history.component.html',
  styleUrls: ['./experiment-history.component.css']
})
export class ExperimentHistoryComponent implements OnChanges {
  columnNames = [];
  dataSource?: ExperimentHistoryDataSource = null;
  poolIdentifiers = [];

  @Input() pools = [];

  constructor() {}

  ngOnChanges() {
    this.poolIdentifiers = this.pools.map(pool => pool.identifier);
    this.dataSource = new ExperimentHistoryDataSource(this.pools);
    this.columnNames = ['date', 'key', 'description'].concat(this.poolIdentifiers);
  }
}
