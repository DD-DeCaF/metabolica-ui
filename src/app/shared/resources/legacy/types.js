// measurement types that either have no physical quantity, or are a physical quantity (e.g. temperature)
// used to abbreviate rendering of measurement labels
export const SINGLE_QUANTITY_MEASUREMENT_TYPES = [
	'biomass',
	'temperature',
	'carbon-balance',
	'electron-balance'
];

export class Measure {

	constructor({quantity, compounds = null, compartment = null, unit = null}) {
		this.quantity = quantity;
		this.compounds = compounds || [];
		this.compartment = compartment;
		this.unit = unit;
		this.key = this._computeKey();
	}

	_computeKey() {
		return [
			this.quantity,
			this.compounds.length ? this.compounds.map(compound => compound.chebiId) : null,
			this.compartment,
			this.unit]
			.filter(part => part !== null)
			.join('-');
	}
}


export class AggregateScalar {
	constructor(aggregate, {test, measurements, phase = null}) {
		this.aggregate = aggregate;
		this.measurements = measurements;
		this.test = test;
		this.phase = phase;
	}

	replicates(sample) {
		return this.measurements[this.aggregate.sampleKeys.get(sample)] || [];
	}

	get samples() {
		return Object
			.keys(this.measurements)
			.map(sampleKey => this.aggregate._samples[sampleKey]);
	}
}

function mean(values) {
	return values.reduce((a, b) => a + b, 0) / values.length;
}

const CONCENTRATION_TO_YIELD_OD_THRESHOLD = 0.3;

export class Aggregate {
	constructor({samples, scalars, series}) {
		// samples must either be an object or an Array. If it is an Array,
		// a sample object is created, keyed by `s${sample.id}`.

		let sampleObj;
		if (samples instanceof Array) {
			sampleObj = {};
			for (let sample of samples) {
				sampleObj[`s${sample.id}`] = sample;
			}
		} else {
			sampleObj = samples;
		}

		this._samples = sampleObj;
		this.scalars = scalars.map(scalar => new AggregateScalar(this, scalar));

		// TODO only if no yields

		let hasYields = this.tests.some(test => test.type === 'yield');

		if (!hasYields) {
			let ODs = this.findByAttr('biomass', 'OD');
			if (ODs) {
				let concentrations = [];
				for (let scalar of this.scalars) {
					if (scalar.test.type === 'concentration') {

						let measurements = {};

						for (let key of Object.keys(ODs.measurements)) {
							let OD = mean(ODs.measurements[key]);

							if (OD > CONCENTRATION_TO_YIELD_OD_THRESHOLD && scalar.measurements[key]) {
								measurements[key] = scalar.measurements[key].map(value => value / OD);
							}
						}

						if (Object.keys(measurements).length) {
							concentrations.push(new AggregateScalar(this, {
								measurements,
								test: ({
									type: 'yield',
									numerator: scalar.test.numerator,
									// FIXME unit is a hack
									denominator: new Measure({quantity: 'OD', unit: scalar.test.denominator.unit}),
                                    rate: '',
                                    id: scalar.test.id
								})
							}));
						}
					}
				}

				this.scalars = this.scalars.concat(concentrations);
			}
		}

		this.series = series;

		let sampleKeys = this.sampleKeys = new WeakMap();
		for (let sampleKey of Object.keys(sampleObj)) {
			sampleKeys.set(sampleObj[sampleKey], sampleKey);
		}
	}

	get samples() {
		return Object
			.keys(this._samples)
			.map(sampleKey => this._samples[sampleKey]);
	}

	get tests() {
		return this.scalars.map(scalar => scalar.test);
	}

	find(test) {
		// TODO refactor to return both scalar and series
		for (let scalar of this.scalars) {
			if (test.id === scalar.test.id) {
				return scalar;
			}
		}
	}

	findByAttr(type, num_quantity) {
        for (let scalar of this.scalars) {
            if (scalar.test.type === type) {
                if (scalar.test.numerator && scalar.test.numerator.quantity === num_quantity) {
                    return scalar;
                }
            }
        }
    }
}


class AggregateAggregateScalar {
	constructor(test, aggregates) {
		this.test = test;
		this.scalars = aggregates
			.map(aggregate => aggregate.find(this.test))
			.filter(scalar => scalar !== undefined);
	}

	get samples() {
		return this.scalars
			.map(scalar => scalar.samples)
			.reduce((a, b) => a.concat(b), []);
	}

	replicates(sample) {
		return this.scalars
			.map(scalar => scalar.replicates(sample))
			.reduce((a, b) => a.concat(b), []);
	}
}


export class AggregateList {
	constructor(aggregates = []) {
		this.aggregates = aggregates;
	}

	add(aggregate) {
		if (Array.isArray(aggregate)) {
			this.aggregates = this.aggregates.concat(aggregate);
		} else if (aggregate instanceof Aggregate) {
			this.aggregates.push(aggregate);
		}
	}

	find(test) {
		return new AggregateAggregateScalar(test, this.aggregates);
	}

	samples() {
		if (this.aggregates.length) {
			return this.aggregates
				.map(aggregate => aggregate.samples)
				.reduce((a, b) => a.concat(b), []);
		}

		return [];
	}

	/**
	 * Unique Array of Test items
	 * @returns {Array<Test>}
	 */
	tests() {
		let tests = new Map();
		for (let aggregate of this.aggregates) {
			for (let test of aggregate.tests) {
				if (!tests.has(test.id)) {
					tests.set(test.id, test);
				}
			}
		}
		return Array.from(tests.values());
	}
}
