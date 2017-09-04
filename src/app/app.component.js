import template from './app.component.html';
import './app.component.scss';


class AppController {

    constructor($state, $rootScope, appNavigation, appAuth, appName, Session, Project, Policy, $mdSidenav, $mdMedia, $q, $transitions) {
        this._Session = Session;
        this._Policy = Policy;
        this._$rootScope = $rootScope;
        this._$state = $state;
        this._$mdSidenav = $mdSidenav;
        this._$mdMedia = $mdMedia;
        this._$q = $q;

        this.appName = appName;

        let allNavigation = appNavigation.filter(nav => appAuth.hasPermission(nav.permission));
        if (!$rootScope.isAuthenticated) {
            allNavigation = allNavigation.filter(nav => !nav.authRequired);
        }
        this.projectNavigation = allNavigation.filter(nav => nav.position == 'project');
        this.navigation = allNavigation.filter(nav => nav.position == 'global');

        $transitions.onBefore({}, transition => {
            const targetState = transition.targetState().$state();

            for(const nav of appNavigation){
                if (!nav.requirePermission){
                    continue;
                }

                // get state from ref
                const stateName = nav.state.split('(')[0];
                const state = $state.target(stateName).$state();

                if (targetState.includes[state.name]) {
                    return this.checkPermissions([nav.requirePermission]);
                }
            }

            return true;
        });

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

    checkPermissions(permissions){
        return this._$q((resolve, reject) => {
            if (!this._Session.isAuthenticated()) {
                resolve(false);
            }

            this._Policy.testPermissions({permissions: JSON.stringify(permissions)}).then(allowedPermissions => {
                if (allowedPermissions.length){
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(() => {
                resolve(false);
            });
        });
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
