import template from './app.component.html';
import './app.component.scss';


class AppController {

    constructor($state, $rootScope, appNavigation, appName, Session, Project) {
        this._Session = Session;
        this._$rootScope = $rootScope;
        this._$state = $state;

        this.appName = appName;
        this.projectNavigation = appNavigation[$rootScope.isAuthenticated].filter(nav => nav.position == 'project');
        this.navigation = appNavigation[$rootScope.isAuthenticated].filter(nav => nav.position == 'global');

        this.projects = [];
        Project.query().then((projects) => {
            this.projects = projects
        });
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
}


export const AppComponent = {
    bindings: {},
    controller: AppController,
    template
};
