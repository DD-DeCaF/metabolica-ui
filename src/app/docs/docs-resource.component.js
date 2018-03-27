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
