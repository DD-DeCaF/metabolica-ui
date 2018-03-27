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

import template from './login.component.html';
import './login.component.scss';

/** This class is LoginComponent's controller */
class LoginController {
    appName;
    credentials;

    /**
     * LoginController class constructor
     * @param Session  comment about Session parameter
     * @param appName  The application name to show during login
     */
    constructor($scope, $timeout, $state, $stateParams, $location, Session, appName) {
        this.appName = appName;
        this.credentials = {
            username: '',
            password: ''
        };

        this.authenticate = async (form, credentials) => {
            try {
                await Session.authenticate(credentials);

                if ($stateParams.next) {
                    $timeout(() => {
                        $location
                            .path(decodeURIComponent($stateParams.next))
                            .search({}); // clear the next param
                    }, 100);
                } else {
                    $state.go('app.home');
                }
            } catch (invalidCredentials) {
                form.password.$setValidity('auth', false);
                form.$setPristine();
                $scope.$apply();
            }
        };
    }
}

export const LoginComponent = {
    controller: LoginController,
    template
};
