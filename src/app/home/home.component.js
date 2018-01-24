
class HomeController {
    constructor(appName, $mdSidenav) {
        this.appName = appName;
        this._$mdSidenav = $mdSidenav;
    }
}


export const HomeComponent = {
    controller: HomeController,
    template: `
    <div class="md-padding">
        <md-content>
            <h1 class="md-display-1">Welcome to {{ $ctrl.appName }}</h1>
            <p>Get started by selecting a project or one of the tools.</p>
        </md-content>
    </div>`
};
