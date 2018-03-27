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

import template from './app-toolbar.component.html';

class AppToolbarController {

	constructor($scope, $state, $rootScope, $mdSidenav, $sharing, Session, Project, appNavigation, $mdMedia) {
		this._$state = $state;
		this._$rootScope = $rootScope;
		this._$mdSidenav = $mdSidenav;
		this._Session = Session;
		this._$mdMedia = $mdMedia;

		this.isAuthenticated = $rootScope.isAuthenticated;

    $sharing.onShareChange(targets => {
				this.sharing = {targets, open: $sharing.open};
		});

		this.projects = [];
		Project.query().then(projects => {
			this.projects = projects;
		});

        this.navigation = appNavigation.filter(nav => nav.position == 'toolbar');
        if (!this.isAuthenticated) {
            this.navigation = this.navigation.filter(nav => !nav.authRequired);
        }
	}

	get project() {
		return this._$rootScope.project;
	}

	getTitle() {
		return this._$state.current.data && this._$state.current.data.title;
	}

	get inProjectComponent() {
		let $state = this._$state;
		return $state.includes('app.project') && !$state.is('app.project');
	}

	switchTo(project) {
		let $state = this._$state;

		if (this.project == project) {
			$state.go('app.project', {projectId: project.id});
		} else {
			// switch to a (different) project while staying in the same route.
			// use the 'switchable' information on state. go up to nearest switchable state.
			if ($state.current.data && $state.current.data.switchable) {
				$state.go($state.current.data.switchable, {projectId: project.id}, {inherit: true});
			} else {
				$state.go('app.project', {projectId: project.id});
			}
		}
	}

	logout() {
		this._Session.logout();
	}

	login() {
		this._Session.login();
	}
}

export const AppToolbarComponent = {
	controller: AppToolbarController,
	template,
    require: {
        appCtrl: '^app'
    }
};
