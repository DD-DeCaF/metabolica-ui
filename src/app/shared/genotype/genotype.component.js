import './genotype.component.scss';

class GenotypeController {

    constructor($sce, Genotype) {
        this._$sce = $sce;
        this._Genotype = Genotype;
    }

    $onChanges() {
        let gnomicString = null;
        if (this.parts) {
            gnomicString = this.parts.join(' ');
        } else if (this.value) {
            gnomicString = this.value;
        }

        if (this.gnomic === gnomicString) {
            return;
        }
        this.gnomic = gnomicString;
        this.isValid = true;

        if (this.gnomic && (typeof this.gnomic === 'string' || this.gnomic instanceof String)) {
            this.gnomicHTML = this._$sce.trustAsHtml(escapeHTML(this.gnomic));
            if (this.isFeature) {
                this.parseAsFeature();
            } else {
                this.parseAsGenotype();
            }
        } else {
            this.gnomicHTML = this._$sce.trustAsHtml('&mdash;');
        }
    }

    parseAsGenotype() {
        this._Genotype.formatGnomicAsHTML({value: this.gnomic}, {cache: true})
            .then(response => {
                if (!response.valid) {
                    this.isValid = false;
                } else {
                    this.gnomicHTML = this._$sce.trustAsHtml(response.html);
                }
            });
    }

    parseAsFeature() {
        this._Genotype.formatFeatureAsHTML({value: this.gnomic}, {cache: true})
            .then(response => {
                if (!response.valid) {
                    this.isValid = false;
                } else {
                    this.gnomicHTML = this._$sce.trustAsHtml(response.html);
                }
            });
    }
}


export const GenotypeComponent = {
    bindings: {
        parts: '<',
        value: '<',
        isFeature: '<'
    },
    controller: GenotypeController,
    template: `<span ng-class="{invalid: !$ctrl.isValid}" ng-bind-html="$ctrl.gnomicHTML"></span>`
};


function escapeHTML(str) {
    return str.replace(/[&<>]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    }[tag]));
}
