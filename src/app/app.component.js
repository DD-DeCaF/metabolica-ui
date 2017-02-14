import './app.component.scss';


class AppController {

    constructor($state, $rootScope, appNavigation, Session, Project) {
        this._Session = Session;
        this._$rootScope = $rootScope;
        this._$state = $state;

        this.projectNavigation = appNavigation.filter(nav => nav.requiresProject);
        this.navigation = appNavigation.filter(nav => !nav.requiresProject);

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
    template: `
		<div layout="row" flex>
			<!-- TODO: we need a menu icon that can open the sidebar when sidebar is hidden (small screen size) -->
			<md-sidenav layout="column" class="md-sidenav-left md-whiteframe-z1" md-component-id="left"
			 md-is-locked-open="$mdMedia('gt-sm')">
				<md-toolbar ng-style="{backgroundColor: $ctrl.project.color}" class="project-color">
					<div class="md-toolbar-tools">
                        <h1 flex>
                            <a ng-if="$ctrl.project"
                                style="white-space: nowrap"
                               ui-sref="app.project({projectId: $ctrl.project.id})">
                                {{ $ctrl.project.name }}</a>
                            <span ng-if="!$ctrl.project">iLoop</span>
                        </h1>

						<md-menu md-position-mode="target-right target">
							<md-button aria-label="More" class="md-icon-button" ng-click="$mdMenu.open($event)">
								<md-icon>arrow_drop_down</md-icon>
							</md-button>
							<md-menu-content width="4">
								<md-menu-item ui-sref="app.home">
									<md-button>
										<div layout="row">
											<p flex>Home</p>
											<md-icon md-menu-align-target>home</md-icon>
										</div>
									</md-button>
								</md-menu-item>
								<md-menu-divider></md-menu-divider>
								<!--<md-subheader>Projects</md-subheader>-->
								<md-menu-item ng-repeat="project in $ctrl.projects">
									<md-button ng-click="$ctrl.switchTo(project)">
										<div layout="row">
											<p flex>{{ project.name }}</p>
											<md-icon md-menu-align-target
											         ng-style="{color: project.color}">folder</md-icon>
										</div>
									</md-button>
								</md-menu-item>
							</md-menu-content>
						</md-menu>
					</div>
				</md-toolbar>

                <md-list ng-hide="$ctrl.project">
                    <md-subheader class="md-no-sticky">Projects</md-subheader>
                    <md-list-item ng-repeat="project in $ctrl.projects"
                                  ui-sref="app.project({projectId: project.id})">
                        <md-icon ng-style="{color: project.color}">folder</md-icon>
                        <p>{{ project.name }}</p>
                    </md-list-item>
                </md-list>

				<md-list ng-show="$ctrl.project">
                    <md-list-item
                            ng-repeat="component in $ctrl.projectNavigation"
                            ui-sref="{{ component.state }}">
                        <md-icon md-svg-icon="{{ component.icon }}"></md-icon>
                        <p>{{ component.title }}</p>
                        </a>
                    </md-list-item>
                </md-list>

                <md-divider></md-divider>

                <md-list>
                    <md-list-item ng-repeat="component in $ctrl.navigation" ui-sref="{{ component.state }}">
                        <md-icon md-svg-icon="{{ component.icon }}"></md-icon>
                        <p ng-if="!$ctrl.inProjectComponent">{{ component.title }}</p>
                    </md-list-item>
                </md-list>
			</md-sidenav>

			<div layout="column" flex id="content">
                <app-toolbar></app-toolbar>
                <ui-view layout="column" flex></ui-view>
			</div>
		</div>
	`
};