// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const RESOURCE_KEY_PROPERTY_NAMES = {
	experiment: "identifier",
	medium: "identifier",
	feedMedium: "identifier",
	strain: "identifier",
	pool: "identifier",
	plate: "barcode",
	tube: "barcode"
};

const RESOURCE_LABEL_PROPERTY_NAMES = {
	experiment: "identifier",
	medium: "name",
	feedMedium: "name",
	strain: "identifier",
	pool: "identifier",
	plate: "barcode",
	tube: "barcode"
};

const RESOURCE_COMPARATORS = {
	strain: (a, b) => {
		if(!a || !b) {
			return !!b - !!a;
		}

		if(a.pool !== b.pool) {
			return RESOURCE_COMPARATORS.pool(a.pool, b.pool);
		}

		return b.sequence - a.sequence;
	},
	pool: (a, b) => {
		if(!a || !b) {
			return !!b - !!a;
		}

		if(a.project !== b.project) {
			return a.localeCompare(b);
		}

		return b.sequence - a.sequence;
	}
};


export class SampleTable {
	constructor(propertyNames) {
		this.propertyNames = propertyNames;
		this._samples = {};
		this._groups = {};
		this._properties = {};

		for(let name of propertyNames) {
			this._properties[name] = new Set();
		}
	}

	add(sample) {
		let group = this.propertyNames.map(name => SampleTable.property(sample, name));
		let groupKey = this.propertyNames.map((name, i) => SampleTable.propertyKey(name, group[i])).join('.');

		for(let name of this.propertyNames) {
			this._properties[name].add(SampleTable.property(sample, name))
		}

		if(this._samples[groupKey]) {
			this._samples[groupKey].push(sample);
		} else {
			this._samples[groupKey] = [sample];
			this._groups[groupKey] = group;
		}
	}

	get(group, default_ = null) {
		let groupKey = this.propertyNames.map((name, i) => SampleTable.propertyKey(name, group[i])).join('.');
		return this._samples[groupKey] || default_;
	}

	keys() {
		return Object.values(this._groups);
	}

	values() {
		return Object.values(this._samples);
	}

	groups() {
		return Object
			.entries(this._groups)
			.map(([groupKey, group]) => ({group, samples: this._samples[groupKey]}));
	}

	properties(name) {
		return this._properties[name].values();
	}

	sortedProperties(name) {
		// TODO for pools, strains, sort by sequence
		let keyProperty = RESOURCE_KEY_PROPERTY_NAMES[name];
		return Array
			.from(this._properties[name].values())
			.sort(RESOURCE_COMPARATORS[name] || ((a, b) => {
					// sorting empty properties
					if (!a || !b) {
						return !!b - !!a
					}

					return a[keyProperty].localeCompare(b[keyProperty]);
				}));
	}

	static property(sample, propertyName) {
		switch (propertyName) {
			case 'pool':
				return sample.strain ? sample.strain.pool : null;
			default:
				return sample[propertyName];
		}
	}

	static label(sample, propertyName) {
		return SampleTable.propertyLabel(propertyName, SampleTable.property(sample, propertyName))
	}

	static propertyLabel(propertyName, property, default_='<blank>') {
		if(propertyName == 'position') {
			return property
		}

		if(property) {
			return property[RESOURCE_LABEL_PROPERTY_NAMES[propertyName]]
		}

		return default_;
	}

	static propertyKey(propertyName, property) {
		if(propertyName == 'position') {
			return property
		}

		if(property) {
			return property[RESOURCE_KEY_PROPERTY_NAMES[propertyName]]
		}
		return null;
	}
}

export class SampleMagic {

	constructor(samples) {
		this._samples = samples;
	}

	static table(samples, propertyNames) {
		let table = new SampleTable(propertyNames);
		for(let sample of samples) {
			table.add(sample);
		}

		return table
	}

	static groupBy(samples, propertyName, sorted=true) {
		if (sorted) {
			let table = this.table(samples, [propertyName]);
			return table.sortedProperties(propertyName).map(group => ({group, samples: table.get([group])}))
		} else {
			return this.table(samples, [propertyName])
				.groups()
				.map(({samples, group}) => ({samples, group: group[0]}));
		}
	}

	/**
	 * Different measurements for a single strain may be recorded in different experiments. To compare
	 * these in a scatter plot, collapse() groups all the samples from the same plate & position.
	 *
	 * @param samples
	 */
	static collapse(samples) {
		let groups = {}, unknown = [];

		for(let sample of samples) {
			if(!sample.plate || ! sample.position) {
				unknown.push(sample); // these cannot be grouped - assume they're independent.
			} else {
				let key = `${sample.plate.barcode}.${sample.position}`;
				if(groups[key]) {
					groups[key].push(sample);
				} else {
					groups[key] = [sample];
				}
			}
		}

		return Object.values(groups)
			.map(groupedSamples => Object.assign({}, groupedSamples[0], {
				experiment: null, // cannot be certain this is the same for all samples
				scalars: groupedSamples
					.map(sample => sample.scalars)
					.reduce((a, b) => a.concat(b), [])
			}))
			.concat(unknown);
	}

	static aggregate(samples, scalar, default_ = NaN) {
		let values = samples
			.map((sample) => scalar.replicates(sample))
			.reduce((a, b) => a.concat(b), []);

		return SampleMagic.reduceValues(values, default_);
	}

	static filter(samples, measurement) {
		return samples
			.filter(sample => sample.scalars
				.some((scalar) => measurement.match(scalar)));
	}

	static filterSome(samples, measurements) {
		return samples
			.filter(sample => sample.scalars
				.some(scalar => measurements
					.some((measurement) => measurement.match(scalar))));
	}

	static filterEvery(samples, measurements) {
		return samples
			.filter(sample => measurements
				.every((measurement) => sample.scalars
					.some(scalar => measurement.match(scalar))));
	}

	static pluck(samples, measurement) {
		return samples.map(sample => SampleMagic.value(sample, measurement));
	}

	static values(sample, measurement) {
		return sample.scalars
			.filter(scalar => measurement.match(scalar))
			.map(scalar => scalar.value);
	}

	static value(sample, measurement) {
		return SampleMagic.reduceValues(SampleMagic.values(sample, measurement));
	}

	static reduceValues(values, default_ = NaN) {
		if (values.length == 0) {
			return {mean: default_, std: default_};
		}

		let mean = values.reduce((a, b) => a + b) / values.length;

		// Standard Deviation
		// Check the sample standard deviation at https://www.mathsisfun.com/data/standard-deviation-formulas.html
		// for more info on the mathematics behind it.
		let std = Math.sqrt(values.reduce((a, b) => a + Math.pow((b - mean), 2), 0) / (values.length - 1));

		let stderr = std / Math.sqrt(values.length);

		return {
			mean,
			std,
			stderr
		};
	}

	// XXX(lars) this seems redundant
	static measurementLabel(measurement) {
		return measurement.labelAsHTML();
	}
}


for (let methodName of [
	'map',
	'groupBy',
	'aggregate',
	'pluck',
	'filter',
	'filterSome',
	'filterEvery'
]) {
	// TODO make filter() etc. return another SampleMagic instance.
	SampleMagic.prototype[methodName] = function (...args) {
		return this.constructor[methodName](this._samples, ...args);
	}
}
