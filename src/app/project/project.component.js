import './project.component.scss';

export const ProjectComponent = {
    bindings: {
        project: '<project'
    },
    template: `
    <ui-view layout="column" flex>
        <project-overview project="$ctrl.project">
            <md-content class="layout-padding">
                <p>You are now browsing {{ ::$ctrl.project.name }}</p>
            </md-content>
        </project-overview>
    </ui-view>`
};