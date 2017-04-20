import template from './app-toolbar.component.html';

class AppToolbarController {

	constructor($scope, $state, $rootScope, $mdSidenav, $sharing, Session, Project, appNavigation) {
		this._$state = $state;
		this._$rootScope = $rootScope;
		this._$mdSidenav = $mdSidenav;
		this._Session = Session;
        this.isAuthenticated = $rootScope.isAuthenticated;

        $sharing.onShareChange(targets => {
            this.sharing = {targets, open: $sharing.open};
        });

		this.projects = [];
		Project.query().then((projects) => {
			this.projects = projects
		});

		this.navigation = appNavigation[this.isAuthenticated].filter(nav => nav.position == 'toolbar');
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

	toggleSidenav(menuId) {
		this._$mdSidenav(menuId).toggle();
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
	template
};
