import {scaleOrdinal, schemeCategory20} from 'd3-scale';

class TestPlotController {
    $onChanges() {
        if (this.selections) {
            const {measurements, resourceToCompare, groupBy} = this.selections;
            this.plotJSON = getPlotObject(measurements, resourceToCompare, groupBy);
        }
    }
}

export const TestPlotComponent = {
    bindings: {
        selections: '<'
    },
    controller: TestPlotController,
    template: `<plot class="md-padding"
                     plot-data="$ctrl.plotJSON.data"
                     plot-layout="$ctrl.plotJSON.layout"
                     ng-if="$ctrl.plotJSON"></plot>`
};

function getPlotObject(measurements, boxType, groupBy) {
    const colorScale = scaleOrdinal(schemeCategory20);
    const boxTypeIdKey = RESOURCE_ID_KEY[boxType];
    const boxTypeLabelKey = RESOURCE_LABEL_KEY[boxType];
    let boxes = new Map();
    let groupByIdKey = null;
    let groupByLabelKey = null;
    let groups = null;

    for (const measurement of measurements) {
        boxes.set(measurement[boxTypeIdKey], measurement[boxTypeLabelKey]);
    }

    if (groupBy) {
        groupByIdKey = RESOURCE_ID_KEY[groupBy];
        groupByLabelKey = RESOURCE_LABEL_KEY[groupBy];
        groups = new Map();
        for (const measurement of measurements) {
            groups.set(measurement[groupByIdKey], measurement[groupByLabelKey]);
        }
    }

    return {
        data: Array.from(boxes.entries())
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(([boxId, boxLabel]) => {
                const boxMeasurements = measurements.filter(measurement => measurement[boxTypeIdKey] === boxId);
                return {
                    name: boxLabel,
                    y: boxMeasurements.map(measurement => measurement.value),
                    x: groupBy ? boxMeasurements.map(measurement => groups.get(measurement[groupByIdKey])) : null,
                    type: 'box',
                    marker: {
                        color: colorScale(groupBy ? boxLabel : 'default'),
                        size: 5
                    },
                    boxpoints: 'all',
                    pointpos: 0,
                    jitter: 0.7
                };
            }),
        layout: {
            boxmode: 'group',
            height: 500,
            margin: {t: 25, l: 40, r: 20, b: 120},
            showlegend: !!groupBy,
            xaxis: {
                categoryorder: 'array',
                categoryarray: groupBy ? Array.from(groups.values()).sort((a, b) => a.localeCompare(b)) : null
            },
            yaxis: {title: measurements[0].test.displayName},
            annotations: [
                {
                    text: groupBy ? boxType : '',
                    xref: 'paper',
                    yref: 'paper',
                    x: 1.03,
                    y: 1,
                    showarrow: false,
                    xanchor: 'left',
                    yanchor: 'bottom'
                }
            ]
        }
    };
}

export const RESOURCE_ID_KEY = {
    experiment: 'experimentId',
    genotype: '',
    medium: 'sampleMediumId',
    plate: 'samplePlateId',
    pool: 'samplePoolId',
    strain: 'sampleStrainId'
};

export const RESOURCE_LABEL_KEY = {
    experiment: 'experimentIdentifier',
    genotype: 'samplePoolGenotype',
    medium: 'sampleMediumName',
    plate: 'samplePlatePosition',
    pool: 'samplePoolIdentifier',
    strain: 'sampleStrainIdentifier'
};
