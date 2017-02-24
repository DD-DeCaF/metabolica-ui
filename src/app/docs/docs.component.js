import './docs.component.scss'
import template from './docs.component.html';

class DocumentationController {
    constructor(potion, $http, appName) {
        this.schema = null;
        this.resourceNames = null;
        this.appName = appName;

        $http.get(`${potion.prefix}/schema`).then((response) => {
            let schema = this.schema = response.data;
            this.resourceNames = Object.keys(schema.properties);
        })
    }
}


export const DocsComponent = {
    controller: DocumentationController,
    template
};
