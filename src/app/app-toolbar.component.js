
class AppToolbarController {

    constructor($state, $rootScope, Session, Project, appNavigation) {
        this._$state = $state;
        this._$rootScope = $rootScope;
        this._Session = Session;

        this.projects = [];
        Project.query().then((projects) => {
            this.projects = projects
        });

		this.navigation = appNavigation.filter(nav => nav.position == 'toolbar');
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
}

export const AppToolbarComponent = {
    controller: AppToolbarController,
    template: `
    <md-toolbar ng-hide="shouldHideMenus()"
                ng-style="{backgroundColor: $ctrl.project.color}"
                class="md-theme-light color-transition"
                layout="row">
        <div class="md-toolbar-tools">
            <md-button hide-gt-sm ng-click="toggleSidenav('left')"
                    class="md-icon-button">
                <md-icon aria-label="Menu">menu</md-icon>
            </md-button>

            <div ng-hide="showSearch" ui-view="toolbar" flex>
                <h1>{{ $ctrl.getTitle() }}</h1>
                <span flex></span>
            </div>

            <md-autocomplete
                    ng-if="showSearch"
                    md-autofocus="true"
                    md-selected-item="search.selectedItem"
                    md-search-text-change="search.searchTextChange(ctrl.searchText)"
                    md-search-text="search.searchText"
                    md-selected-item-change="search.selectedItemChange(item)"
                    md-items="item in search.querySearch(search.searchText)"
                    md-item-text="item.display"
                    md-min-length="2"
                    placeholder="Search plates, media, pools, isolates and more."
                    flex>
                <md-item-template>
                    <div layout="row">
                        <span md-highlight-text="search.searchText" md-highlight-flags="^i">{{ item.display }}</span>
                        <span flex></span>
                        <span class="md-caption">{{ item.type }}</span>
                    </div>
                </md-item-template>
                <md-not-found>
                    No matches found for "{{search.searchText}}".
                </md-not-found>
            </md-autocomplete>

            <md-button aria-label="More" class="md-icon-button" ng-click="toggleSearch()">
                <md-icon ng-hide="showSearch">search</md-icon>
                <md-icon ng-show="showSearch">cancel</md-icon>
            </md-button>

            <!--<md-input-container>-->
            <!--<label for="search">Search</label>-->
            <!--<input type="text" id="search" ng-model="search">-->
            <!--</md-input-container>-->

            <md-menu ng-show="sharing.targets.length" md-position-mode="target-right target">
                <md-button class="md-icon-button" ng-click="$mdOpenMenu($event)">
                    <md-icon>share</md-icon>
                </md-button>

                <md-menu-content width="4">
                    <md-menu-item ng-repeat="target in sharing.targets">
                        <md-button ng-click="sharing.open(target.state)">
                            <div layout="row">
                                <p flex>{{ target.name }}</p>
                                <md-icon md-menu-align-target>share</md-icon>
                            </div>
                        </md-button>
                    </md-menu-item>
                </md-menu-content>
            </md-menu>

            <md-menu>
                <md-button aria-label="More" class="md-icon-button" ng-click="$mdMenu.open($event)">
                    <md-icon>more_vert</md-icon>
                </md-button>
                <md-menu-content width="4">
                    <md-list-item ng-repeat="component in $ctrl.navigation" ui-sref="{{ component.state }}">
                        <md-icon md-svg-icon="{{ component.icon }}"></md-icon>
                        <p ng-if="!$ctrl.inProjectComponent">{{ component.title }}</p>
                    </md-list-item>
                    <md-menu-divider ng-if="$ctrl.navigation.length"></md-menu-divider>
                    <md-menu-item>
                        <md-button ui-sref="app.docs">
                            <md-icon>book</md-icon>
                            API Documentation
                        </md-button>
                    </md-menu-item>
                    <md-menu-divider></md-menu-divider>
                    <md-menu-item>
                        <md-button ng-click="$ctrl.logout()">
                            <md-icon>lock</md-icon>
                            Log Out
                        </md-button>
                    </md-menu-item>
                </md-menu-content>
            </md-menu>
        </div>
    </md-toolbar>`
};
