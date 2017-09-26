import template from './app.component.html';
import './app.component.scss';


class AppController {

    constructor($state, $rootScope, appNavigation, appName, Session, Project, Policy, $mdSidenav, $mdMedia, $stateParams) {
        this._Session = Session;
        this._Policy = Policy;
        this._$rootScope = $rootScope;
        this._$state = $state;
        this._$mdSidenav = $mdSidenav;
        this._$mdMedia = $mdMedia;

        this.appName = appName;

        this.allNavigation = appNavigation;
        if (!$rootScope.isAuthenticated) {
            this.allNavigation = this.allNavigation.filter(nav => !nav.authRequired);
        }

        this.projectNavigation = this.allNavigation.filter(nav => nav.position === 'project');
        this.navigation = this.allNavigation.filter(nav => nav.position === 'global');
        this.projectNavigationPermissions = new Set(this.projectNavigation.filter(({requirePermission}) => requirePermission).map(({requirePermission}) => requirePermission));
        this.navigationPermissions = new Set(this.navigation.filter(({requirePermission}) => requirePermission).map(({requirePermission}) => requirePermission));

        if (this.project){
            this.filterProjectNavigation(this.project);
        }

        if (this.navigationPermissions.size) {
            Policy.testPermissions({
                permissions: JSON.stringify(this.navigationPermissions)
            }).then(allowedPermissions => {
                allowedPermissions = new Set(allowedPermissions);
                this.navigation = this.navigation.filter(nav => !(nav.requirePermission && !allowedPermissions.has(nav.requirePermission)));
            }).catch(() => {
                this.navigation = this.navigation.filter(nav => !nav.requirePermission);
            });
        }

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

        this.filterProjectNavigation(project);

        if (this.project === project) {
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

    filterProjectNavigation(project) {
        this.projectNavigation = this.allNavigation.filter(nav => nav.position === 'project');
        if (!this.projectNavigationPermissions.size) {
            return;
        }

        this._Policy.testProjectPermissions({
            project,
            permissions: JSON.stringify(this.projectNavigationPermissions)
        }).then(allowedPermissions => {
            allowedPermissions = new Set(allowedPermissions);
            this.projectNavigation = this.projectNavigation.filter(nav => !(nav.requirePermission && !allowedPermissions.has(nav.requirePermission)));
        }).catch(() => {
            this.projectNavigation = this.projectNavigation.filter(nav => !nav.requirePermission);
        });
    }

    logout() {
        this._Session.logout();
    }

    isLeftSidenavLockedOpen() {
        return this.lockLeftSidenavOpen && this._$mdMedia('gt-sm');
    }

    isSidenavOpen(menuId) {
        return this._$mdSidenav(menuId).isOpen() ||
            (menuId === 'left' && this.isLeftSidenavLockedOpen());
    }

    openSidenav(menuId) {
        if (menuId === 'left' && this._$mdMedia('gt-sm')) {
            this.lockLeftSidenavOpen = true;
        }

        if (!this._$mdSidenav(menuId).isOpen()) {
            this._$mdSidenav(menuId).open();
        }
    }

    closeSidenav(menuId) {
        if (menuId === 'left') {
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
