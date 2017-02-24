
class AppHomeController {
    constructor(appName) {
        this.appName = appName;
    }
}


export const AppHomeComponent = {
    controller: AppHomeController,
    template: `
    <div class="md-padding">
        <md-content>
            <h1 class="md-display-1">Welcome to {{ $ctrl.appName }}</h1>
            <p>Get started by selecting a project or one of the tools.</p>
        </md-content>
    </div>`
};
