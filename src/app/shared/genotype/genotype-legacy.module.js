import {
    Genotype,
    Mutation,
    Organism,
    Accession,
    Range,
    Phene,
    Feature,
    Fusion,
    Plasmid,
    FeatureTree
} from 'gnomic-grammar';


/**
 * Prototype implementation of a genotype rendering directive.
 */
function GenotypeDirective($cacheFactory) {
    const genotypeCache = $cacheFactory('genotype');

    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '&'
        },
        template: '<span ng-bind-html="output"></span>',
        controller($sce, $scope) {
            $scope.$watch('value', (value) => {
                let genotype = value();

                if (genotype) {
                    let pieces = [];

                    for (let change of genotype.changes(true)) {
                        if (change instanceof Mutation) {
                            if (change.before != null && change.after != null) {
                                // SUB
                                pieces.push(`Δ${featureHTML(change.before)}::${featureHTML(change.after)}`);
                            } else if (change.before == null) {
                                // INS
                                pieces.push(featureHTML(change.after));
                            } else if (change.after == null) {
                                // DEL
                                pieces.push(`Δ${featureHTML(change.before, {integrated: false})}`);
                            }
                        } else if (change instanceof Phene) {
                            pieces.push(featureHTML(change));
                        } else if (change instanceof Plasmid) {
                            pieces.push(featureHTML(change, {integrated: false}));
                        }

                        if (change.marker) {
                            pieces.push(featureHTML(change.marker, {isMarker: true}))
                        }
                    }

                    $scope.output = $sce.trustAsHtml(joinPieces(pieces));
                } else {
                    $scope.output = $sce.trustAsHtml('&mdash;');
                }
            });
        }
    };
}


const GENOTYPE_CLS_PREFIX = 'gnomic';
const GENOTYPE_MARKER_SEPARATOR_CLS = `${GENOTYPE_CLS_PREFIX}-marker-separator`;

function featureHTML(feature, {integrated, isMarker} = {integrated: true, isMarker: false}) {
    if (feature instanceof Plasmid) {
        let nameHTML = `<span class="${GENOTYPE_CLS_PREFIX}-plasmid-name">${feature.name}</span>`;

        if (feature.contents.length) {
            let contentHTML = feature.contents.map(featureHTML).join(' ');

            if (integrated) {
                return `<span class="${GENOTYPE_CLS_PREFIX}-plasmid">${nameHTML}(${contentHTML})</span>`;
            } else {
                return `<span class="${GENOTYPE_CLS_PREFIX}-plasmid">(${nameHTML} ${contentHTML})</span>`;
            }
        } else if (integrated) {
            return `<span class="${GENOTYPE_CLS_PREFIX}-plasmid">${nameHTML}</span>`
        } else {
            return `<span class="${GENOTYPE_CLS_PREFIX}-plasmid">(${nameHTML})</span>`
        }
    } else if (feature instanceof Fusion) {
        return feature.contents.map(featureHTML).join(':');
    } else if (feature instanceof FeatureTree) {
        return feature.contents.map(featureHTML).join(' ');
    } else {
        let html = '';

        if (feature.organism) {
            html += `<span class="${GENOTYPE_CLS_PREFIX}-organism">${feature.organism.name}</span>/`;
        }

        if (isMarker) {
            html += `<span class="${GENOTYPE_MARKER_SEPARATOR_CLS}">::</span>`;
        }

        html += `<span class="${GENOTYPE_CLS_PREFIX}-name">${feature.name}</span>`;

        switch (feature.variant) {
            case 'wild-type':
                html += '<sup>+</sup>';
                break;
            case 'mutant':
                html += '<sup>-</sup>';
                break;
            case null:
                break;
            default:
                html += `<sup>${feature.variant}</sup>`;
        }

        if (feature instanceof Phene) {
            return html;
        } else {
            return `<em>${html}</em>`;
        }
    }
}

function joinPieces(pieces = []) {
    let html = '';

    for (let i = 0; i <= (pieces.length - 1); i++) {

        let current = pieces[i];
        let next = pieces[i + 1];

        html += current;

        if (next && next.indexOf(GENOTYPE_MARKER_SEPARATOR_CLS) == -1) {
            html += ' ';
        }
    }

    return html;
}


export function featureText(feature, {integrated, isMarker, includePlasmidContent} = {integrated: true, isMarker: false, includePlasmidContent: true}) {
    if (feature instanceof Plasmid) {
        let name = feature.name;

        if (feature.contents.length && includePlasmidContent) {
            let content = feature.contents.map(featureText).join(' ');

            if (integrated) {
                return `${name}(${content})`;
            } else {
                return `(${name} ${content})`;
            }
        } else if (integrated) {
            return `${name}`
        } else {
            return `(${name})`
        }
    } else if (feature instanceof Fusion) {
        return feature.contents.map(featureText).join(':');
    } else if (feature instanceof FeatureTree) {
        return feature.contents.map(featureText).join(' ');
    } else {
        let text = '';

        if (isMarker) {
            text += `::`;
        }

        if (feature.organism) {
            text += `${feature.organism.name}/`;
        }

        text += `${feature.name}`;

        switch (feature.variant) {
            case 'wild-type':
                text += '⁺';
                break;
            case 'mutant':
                text += '⁻';
                break;
            case null:
                break;
            default:
                text += `(${feature.variant})`;
        }

        return text;
    }
}

// FIXME unnecessary spaces when merging marker pieces
export function genotypeToText(genotype, {includePlasmidContent=true} = {}) {
    if (genotype == null) {
        return '—';
    }

    let pieces = [];

    for (let change of genotype.changes(true)) {
        if (change instanceof Mutation) {
            if (change.before != null && change.after != null) {
                // SUB
                pieces.push(`Δ${featureText(change.before)}::${featureText(change.after)}`);
            } else if (change.before == null) {
                // INS
                pieces.push(featureText(change.after));
            } else if (change.after == null) {
                // DEL
                pieces.push(`Δ${featureText(change.before)}`);
            }
        } else if (change instanceof Phene) {
            pieces.push(featureText(change));
        } else if (change instanceof Plasmid) {
            pieces.push(featureText(change, {integrated: false, includePlasmidContent}));
        }

        if (change.marker) {
            pieces.push(featureText(change.marker, {isMarker: true}))
        }
    }

    return joinPieces(pieces)
}

export const GenotypeModule = angular
    .module('genotype', [])
    .directive('genotype', GenotypeDirective);
