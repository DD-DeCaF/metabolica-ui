import './genotype.component.scss';


class GenotypeController {

    constructor($sce, Genotype) {
        this._$sce = $sce;
        this._Genotype = Genotype;
    }

    $onChanges(changes) {
        let genotype = null;
        if (this.parts) {
            genotype = this.parts.join(' ');
        } else if (this.value) {
            genotype = this.value;
        }

        if (this.genotype === genotype) {
            return
        }
        this.genotype = genotype;

        this.isValid = true;
        if (genotype === null) {
            this.genotypeHTML = this._$sce.trustAsHtml('&mdash;');
        } else if (typeof genotype === 'string' || genotype instanceof String) {
            genotype = genotype.replace(/ {2,}/g, ' ').trim(); // remove potential extra spaces
            this.genotypeHTML = this._$sce.trustAsHtml(escapeHTML(genotype));
            this._Genotype.formatGnomicAsHTML({value: genotype}, {cache: true})
                .then(response => {
                    if(!response.valid) {
                        this.isValid = false;
                    } else {
                        this.genotypeHTML = this._$sce.trustAsHtml(response.html);
                    }
                });
        } else {
            this.genotypeHTML = genotype.format.html;
        }
    }
}


export const GenotypeComponent = {
    bindings: {
        parts: '<',
        value: '<'
    },
    controller: GenotypeController,
    template: `<span ng-class="{invalid: !$ctrl.isValid}" ng-bind-html="$ctrl.genotypeHTML"></span>`
};


function escapeHTML(str) {
    return str.replace(/[&<>]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    }[tag]));
}
