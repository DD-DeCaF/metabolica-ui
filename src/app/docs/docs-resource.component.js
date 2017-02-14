import './docs.component.scss'
import template from './docs-resource.component.html';


class DocsResourceController {
    constructor($stateParams, potion, $http, $mdDialog) {
        this._$mdDialog = $mdDialog;
        let name = this.name = $stateParams.resourceName;

        $http.get(`${potion.prefix}/${name}/schema`).then((response) => {
            let schema = this.schema = response.data;

            this.description = schema.description;

            this.links = schema.links;
            this.properties = Object.keys(schema.properties).map((name) => {
                return {
                    name,
                    schema: schema.properties[name]
                };
            });
        })
    }

    formatTypes(types) {
        if (types instanceof Array) {
            return types
        } else {
            return [types];
        }
    }

    displaySchema(event, name, schema, targetSchema) {
        const $mdDialog = this._$mdDialog;
        $mdDialog.show({
            targetEvent: event,
            template: `
			<md-dialog>
				<md-toolbar>
					<div class="md-toolbar-tools">
						<h2>{{ name}}</h2>
				  		<span flex></span>
						<md-button class="md-icon-button" ng-click="closeDialog()">
							<md-icon aria-label="Close dialog">close</md-icon>
						</md-button>
					</div>
				</md-toolbar>
				<md-dialog-content>
					<pre class="md-padding" style="max-width: 600px">{{ schema }}</pre>
					<div ng-if="targetSchema">
						<md-divider></md-divider>
						<pre class="md-padding" style="max-width: 600px">{{ targetSchema }}</pre>
					</div>
				</md-dialog-content>
				<md-dialog-actions>
					<md-button ng-click="closeDialog()" class="md-primary">Close</md-button>
				</md-dialog-actions>
			</md-dialog>`,
            controller($scope) {
                $scope.name = name;
                $scope.schema = angular.toJson(schema, true);

                if (targetSchema) {
                    $scope.targetSchema = angular.toJson(targetSchema, true);
                }

                $scope.closeDialog = () => {
                    $mdDialog.cancel();
                }
            },
            clickOutsideToClose: true
        });
    }
}

export const DocsResourceComponent = {
    controller: DocsResourceController,
    template
};


function formatSchemaInterval(schema) {
    return `${schema.exclusiveMinimum ? '(' : '['}` +
        `${typeof schema.minimum == 'undefined' ? '-∞' : schema.minimum}, ` +
        `${typeof schema.maximum == 'undefined' ? '+∞' : schema.maximum}` +
        `${schema.exclusiveMaximum ? ')' : ']'}`;
}

function formatSchemaType(type, schema) {

    if (type == 'object') {
        if (schema.properties && schema.properties.$ref) {
            let target = schema.properties.$ref.pattern.match(/\/api\\\/([a-z0-9-]+)/i)[1];
            type = 'Reference';
            schema.referenceTarget = target;
        } else if (schema.properties && schema.properties.$date) {
            type = 'Date';
        }
    }

    let output = type;
    switch (type) {
        case 'string':
            if (schema.enum) {
                output += `→ enum(${schema.enum.join(', ')})`;
            } else if (schema.format) {
                output += `(${schema.format})`;
            }

            if (schema.minLength || schema.maxLength) {
                output += ' | ';
                if (schema.minLength) {
                    output += `${schema.minLength} ≤ `;
                }
                output += 'length';
                if (schema.maxLength) {
                    output += ` ≤ ${schema.maxLength}`;
                }
            }

            break;

        case 'integer':
        case 'number':
            if (schema.minimum !== undefined || schema.maximum !== undefined) {
                output += ` | ${formatSchemaInterval(schema)}`
            }
            break;

        case 'Reference':
            output += `(${schema.referenceTarget})`;
            break;

        case 'array':
            let arrayTypes;
            if (schema.items.type instanceof Array) {
                arrayTypes = schema.items.type;
            } else {
                arrayTypes = [schema.items.type];
            }

            let types = arrayTypes.map((type) => formatSchemaType(type, schema.items));
            output = `Array<${types.join('|')}>`;

            break;

        case 'null':
        default:
            break
    }

    return output;
}

function SchemaTypeDirective() {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: '=',
            schema: '='
        },
        controller($sce, $scope) {
            $scope.$watchGroup(['type', 'schema'], ([type, schema]) => {
                if (type && schema) {
                    $scope.output = formatSchemaType(type, schema);
                } else {
                    $scope.output = '—';
                }
            });
        },
        template: '<span class="docs-schema-type" ng-bind="output"></span>'
    };
}
