const COMPARABLE_VARIANT_PROPERTIES = [
	'type',
	'position',
	'strand',
	'refSize',
	'refSequence',
	'newSize',
	'newSequence',
	'newCopyNumber',
	'imprecise'
];

export class Variant {
	constructor(item) {
		Object.assign(this, item);
		this.key = `${Object.values(pluck(this.toJSON(), COMPARABLE_VARIANT_PROPERTIES))
            .filter(value => value !== null && value !== undefined).join('-')}+${this.reference.uri}`;
	}

	toJSON() {
		let obj = {};

		for (let key of Object.keys(this).filter(key => !key.startsWith('$') && !key.startsWith('_'))) {
			obj[key] = this[key];
		}

		return Object.assign(obj, {
			strand: this.strand
		});
	}

	equals(variant) {
		if (variant instanceof Variant) {
			return this.key === variant.key;
		}

		return false;
	}

	get aminoAcid() {
		let {aaRefSeq, aaPosition, aaNewSeq} = this.attributes || {};
		if (aaRefSeq != undefined && aaPosition != undefined && aaNewSeq != undefined) {
			return `${aaRefSeq}${aaPosition}${aaNewSeq}`;
		}

		return null;
	}

	get geneProduct() {
		let {geneProduct} = this.attributes || {};
		if (geneProduct !== undefined) {
			return geneProduct;
		}

		return null;
	}

	get geneName() {
		let {geneName} = this.attributes || {};
		if (geneName !== undefined) {
			return geneName;
		}

		return null;
	}

	get snpEffect() {
		let {snpType} = this.attributes || {};
		if (snpType !== undefined) {
			return snpType;
		}

		return null;
	}

	get coverage() {
		let {coverage} = this.attributes || {};
		// Keep in mind that the value could be 0,
		// thus the strict comparison if undefined.
		if (coverage !== undefined) {
			return coverage;
		}

		return null;
	}

	get frequency() {
		let {frequency} = this.attributes || {};
		if (frequency !== undefined) {
			// Sometimes we get NA, set the freq. to 0.00 in that case.
			if (frequency !== 'NA') {
				return frequency;
			} else {
				return 0.00;
			}
		}

		return null;
	}

	get strand() {
		switch (this._strand) {
			case 'forward':
				return 1;
			case 'reverse':
				return -1;
			default:
				break;
		}

		return null;
	}

	set strand(strand) {
		this._strand = strand;
	}
}


/**
 * Create an object containing only the specified keys
 * @param {Object} source - Source object
 * @param {Array} keys - List of keys to include in the new object
 * @returns Object
 */
function pluck(source, keys = []) {
	let obj = {};

	for (let key of Object.keys(source)) {
		if (keys.includes(key)) {
			obj[key] = source[key];
		}
	}

	return obj;
}
