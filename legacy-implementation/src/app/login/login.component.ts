import template from './login.component.html';
import './login.component.scss';

interface Credentials {
    username: string;
    password: string;
}

/** This class is LoginComponent's controller */
class LoginController {
    appName: string;
    credentials: Credentials;
    authenticate: (form: any, credentials: Credentials) => void;

    /**
     * LoginController class constructor
     * @param Session  comment about Session parameter
     * @param appName  The application name to show during login
     */
    constructor($scope, $timeout, $state, $stateParams, $location, Session, appName: string) {
        this.appName = appName;
        this.credentials = {
            username: '',
            password: ''
        };

        this.authenticate = async (form: any, credentials: Credentials) => {
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

    /** @method exampleMethod
     * @param foo  A very detailed comment about the foo parameter
     * @param bar  Something less detailed for bar
     * @returns    The concatenation of the two parameters in input
     */
    exampleMethod(foo: string, bar: string): string {
        console.log('An example of how to document a method.');
        return foo + bar;
    }
}

export const LoginComponent = {
    controller: LoginController,
    template
};
