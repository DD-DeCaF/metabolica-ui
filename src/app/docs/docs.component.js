// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import './docs.component.scss';
import template from './docs.component.html';

class DocumentationController {
    constructor(potion, $http, appName) {
        this.schema = null;
        this.resourceNames = null;
        this.appName = appName;

        $http.get(`${potion.prefix}/schema`).then(response => {
            let schema = this.schema = response.data;
            this.resourceNames = Object.keys(schema.properties);
        });
    }
}


export const DocsComponent = {
    controller: DocumentationController,
    template
};
