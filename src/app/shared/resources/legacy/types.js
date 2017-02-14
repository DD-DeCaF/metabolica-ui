// measurement types that either have no physical quantity, or are a physical quantity (e.g. temperature)
// used to abbreviate rendering of measurement labels
export const SINGLE_QUANTITY_MEASUREMENT_TYPES = [
	'biomass',
	'temperature',
	'carbon-balance',
	'electron-balance'
];

const UNIT_FORMATS = {
	degC: '°C',
	ug: 'μg'
}

/**
 * A compact format of quantities. With compound measurements it is not specified whether mass or amount is used.
 *
 * @param quantity
 * @param compounds
 * @param compartment
 * @returns String
 */
function formatQuantityHTML(quantity, compounds, compartment) {
	if (compounds.length > 0) {
		let s = compounds.map(compound => `<strong>${compound.name}</strong>`).join(', ');
		if (compartment) {
			s += ` <em>${compartment}</em>`;
		}
		return s;
	}

	return `<strong>${quantity}</strong>`;
}


/**
 * A compact format of quantities as plain text.
 * With compound measurements it is not specified whether mass or amount is used.
 *
 * @param quantity
 * @param compounds
 * @param compartment
 * @returns String
 */
function formatQuantityAsText(quantity, compounds, compartment) {
	if (compounds.length > 0) {
		let s = compounds.map(compound => `${compound.name}`).join(', ');
		if (compartment) {
			s += ` ${compartment}`;
		}
		return `[${s}]`;
	}

	return `${quantity}`;
}


function formatUnit(unit) {
	if (UNIT_FORMATS[unit]) {
		return UNIT_FORMATS[unit]
	}

	return unit
}

export class Measure {

	constructor({quantity, compounds=null, compartment=null, unit=null}) {
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


// FIXME rename to Test
/**
 *
 */
export class Test {
	constructor({type, numerator = null, denominator = null, rate = null} = {}) {
		this.type = type;
		this.numerator = !numerator || numerator instanceof Measure ? numerator : new Measure(numerator);
		this.denominator = !denominator || denominator instanceof Measure ? denominator : new Measure(denominator);
		this.rate = rate;
		this.key = this._computeKey();
	}

	_computeKey() {
		return [
			this.type,
			this.numerator ? this.numerator.key : null,
			this.denominator ? this.denominator.key : null,
			this.rate]
			.filter(part => part !== null)
			.join(':');
	}

	labelAsHTML(withType = true) {
		let type;

		// if a measurement type ends with '-rate', remove it because it is superfluous. e.g. uptake-rate -> uptake
		if (this.type.endsWith('-rate')) {
			type = this.type.substr(0, this.type.length - 5)
		} else {
			type = this.type;
		}

		let quantity;
		if (this.numerator) {
			quantity = formatQuantityHTML(this.numerator.quantity,
				this.numerator.compounds,
				this.numerator.compartment);
		} else if (this.denominator) {
			quantity = '1';
		}

		if (this.denominator) {
			if (!(this.type == 'concentration' && this.denominator.quantity == 'volume')) {
				quantity += ` / ${formatQuantityHTML(this.denominator.quantity,
					this.denominator.compounds,
					this.denominator.compartment)}`;
			}
		}

		let unit = '';
		if (this.numerator && this.numerator.unit && this.denominator && this.denominator.unit) {  // x/y
			unit = `${formatUnit(this.numerator.unit)}/${formatUnit(this.denominator.unit)}`
		} else if (this.numerator && this.numerator.unit) { // x
			unit = formatUnit(this.numerator.unit);
		} else if (this.denominator && this.denominator.unit) { // 1/x
			unit = `1/${formatUnit(this.denominator.unit)}`;
		}

		if (this.rate) {
			// NOTE(lars) could also write this as x/r or x/(y*r); choosing this syntax for now because it seems legible
			unit += ` ${formatUnit(this.rate)}<sup>-1</sup>`;
		}

		let parts = [];
		if (withType) {
			parts.push(`<strong>${type}</strong>`)
		}

		if (quantity) {
			parts.push(quantity)
		}

		if (unit) {
			parts.push(`(${unit.trim()})`)
		}

		return parts.join(' ');
	}

	// TODO: implement this same as labelAsHTML without the HTML tags
	labelAsText(withType = true) {
		let type;

		// if a measurement type ends with '-rate', remove it because it is superfluous. e.g. uptake-rate -> uptake
		if (this.type.endsWith('-rate')) {
			type = this.type.substr(0, this.type.length - 5)
		} else {
			type = this.type;
		}

		let quantity;
		if (this.numerator) {
			quantity = formatQuantityAsText(
				this.numerator.quantity,
				this.numerator.compounds,
				this.numerator.compartment
			);
		} else if (this.denominator) {
			quantity = '1';
		}

		if (this.denominator) {
			if (!(this.denominator.quantity == 'volume')) {
				quantity += ` / ${formatQuantityAsText(
					this.denominator.quantity,
					this.denominator.compounds,
					this.denominator.compartment
				)}`;
			}
		}

		let unit = '';
		if (this.numerator && this.numerator.unit && this.denominator && this.denominator.unit) {  // x/y
			unit = `${formatUnit(this.numerator.unit)}/${formatUnit(this.denominator.unit)}`
		} else if (this.numerator && this.numerator.unit) { // x
			unit = formatUnit(this.numerator.unit);
		} else if (this.denominator && this.denominator.unit) { // 1/x
			unit = `1/${formatUnit(this.denominator.unit)}`;
		}

		if (this.rate) {
			unit += ` ${formatUnit(this.rate)}^-1`;
		}

		let parts = [];
		if (withType) {
			parts.push(type)
		}

		if (quantity) {
			parts.push(quantity)
		}

		if (unit) {
			parts.push(`(${unit.trim()})`)
		}

		return parts.join(' ');
	}

	// TODO more efficient implementation
	match(other) {
		if (other instanceof Test) {
			return other.key == this.key;
		} else {
			return new Test(other).key == this.key;
		}
	}
}


export class AggregateScalar {
	constructor(aggregate, {test, measurements, phase=null}) {
		this.aggregate = aggregate;
		this.measurements = measurements;
		this.test = test instanceof Test ? test : new Test(test);
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

		let hasYields = this.tests.some(test => test.type == 'yield');

		if (!hasYields) {
			let ODs = this.find(new Test({type: 'biomass', numerator: {quantity: 'OD'}}));
			if (ODs) {
				let concentrations = [];
				for (let scalar of this.scalars) {
					if (scalar.test.type == 'concentration') {

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
								test: new Test({
									type: 'yield',
									numerator: scalar.test.numerator,
									// FIXME unit is a hack
									denominator: new Measure({quantity: 'OD', unit: scalar.test.denominator.unit})
								})
							}))
						}
					}
				}

				this.scalars = this.scalars.concat(concentrations);
			}
		}

		this.series = series;

		let sampleKeys = this.sampleKeys = new WeakMap();
		for (let sampleKey of Object.keys(sampleObj)) {
			sampleKeys.set(sampleObj[sampleKey], sampleKey)
		}
	}

	get samples() {
		return Object
			.keys(this._samples)
			.map(sampleKey => this._samples[sampleKey]);
	}

	get tests() {
		return this.scalars.map((scalar) => scalar.test);
	}

	find(test) {
		// TODO refactor to return both scalar and series
		for (let scalar of this.scalars) {
			if (test.match(scalar.test)) {
				return scalar;
			}
		}
	}
}


class AggregateAggregateScalar {
	constructor(test, aggregates) {
		this.test = test;
		this.scalars = aggregates
			.map((aggregate) => aggregate.find(this.test))
			.filter((scalar) => scalar !== undefined);
	}

	get samples() {
		return this.scalars
			.map((scalar) => scalar.samples)
			.reduce((a, b) => a.concat(b), []);
	}

	replicates(sample) {
		return this.scalars
			.map((scalar) => scalar.replicates(sample))
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
				.map((aggregate) => aggregate.samples)
				.reduce((a, b) => a.concat(b), []);
		}

		return [];
	}

	/**
	 * Unique Array of Test items
	 * @returns {Array<Test>}
	 */
	tests() {
		console.log(this);
		let tests = new Map();
		for (let aggregate of this.aggregates) {
			for (let test of aggregate.tests) {
				if (!tests.has(test.key)) {
					tests.set(test.key, test)
				}
			}
		}
		return Array.from(tests.values());
	}
}
