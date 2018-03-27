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

import template from './app.component.html';
import './app.component.scss';


class AppController {

    constructor($state, $rootScope, appNavigation, appName, Session, Project, $mdSidenav, $mdMedia) {
        this._Session = Session;
        this._$rootScope = $rootScope;
        this._$state = $state;
        this._$mdSidenav = $mdSidenav;
        this._$mdMedia = $mdMedia;

        this.appName = appName;

        let allNavigation = appNavigation;
        if (!$rootScope.isAuthenticated) {
            allNavigation = allNavigation.filter(nav => !nav.authRequired);
        }
        this.projectNavigation = allNavigation.filter(nav => nav.position == 'project');
        this.navigation = allNavigation.filter(nav => nav.position == 'global');

        this.projectsFetched = false;
        this.projects = [];
        Project.query().then(projects => {
            this.projects = projects;
            this.projectsFetched = true;
        });

        this.lockLeftSidenavOpen = true;
    }

    get project() {
        return this._$rootScope.project;
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

    isLeftSidenavLockedOpen() {
        return this.lockLeftSidenavOpen && this._$mdMedia('gt-sm');
    }

    isSidenavOpen(menuId) {
        return this._$mdSidenav(menuId).isOpen() ||
            (menuId == 'left' && this.isLeftSidenavLockedOpen());
    }

    openSidenav(menuId) {
        if (menuId == 'left' && this._$mdMedia('gt-sm')) {
            this.lockLeftSidenavOpen = true;
        }

        if (!this._$mdSidenav(menuId).isOpen()) {
            this._$mdSidenav(menuId).open();
        }
    }

    closeSidenav(menuId) {
        if (menuId == 'left') {
            this.lockLeftSidenavOpen = false;
        }

        if (this._$mdSidenav(menuId).isOpen()) {
            this._$mdSidenav(menuId).close();
        }
    }
}


export const AppComponent = {
    controller: AppController,
    template
};
