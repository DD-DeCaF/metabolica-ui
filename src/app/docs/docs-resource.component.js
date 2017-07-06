import angular from 'angular';
import './docs.component.scss';
import template from './docs-resource.component.html';


class DocsResourceController {
    constructor($stateParams, potion, $http, $mdDialog) {
        this._$mdDialog = $mdDialog;
        let name = this.name = $stateParams.resourceName;

        $http.get(`${potion.prefix}/${name}/schema`).then(response => {
            let schema = this.schema = response.data;

            this.description = schema.description;

            this.links = schema.links;
            this.properties = Object.keys(schema.properties)
                .map(name =>
                ({
                    name,
                    schema: schema.properties[name]
                })
            );
        });
    }

    formatTypes(types) {
        if (types instanceof Array) {
            return types;
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
                };
            },
            clickOutsideToClose: true
        });
    }
}

export const DocsResourceComponent = {
    controller: DocsResourceController,
    template
};



