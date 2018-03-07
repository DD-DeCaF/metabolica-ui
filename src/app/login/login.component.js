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
