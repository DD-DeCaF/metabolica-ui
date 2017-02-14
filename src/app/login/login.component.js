import template from './login.component.html';
import './login.component.scss';


class LoginController {
    constructor($scope, $timeout, $state, $stateParams, $location, Session) {
        this.credentials = {
            username: '',
            password: ''
        };

        console.log('foo')

        this.authenticate = async(form, credentials) => {
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
        }
    }

}

export const LoginComponent = {
    controller: LoginController,
    template
};