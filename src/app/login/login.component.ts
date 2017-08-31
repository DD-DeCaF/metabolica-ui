import template from './login.component.html';
import './login.component.scss';
import * as firebase from "firebase";

firebase.initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.SENDER_ID
});

interface Credentials {
    username: string;
    password: string;
}

/** This class is LoginComponent's controller */
class LoginController {
    appName: string;
    credentials: Credentials;
    socialAuthAllowed: boolean;
    authenticate: (form: any, credentials: Credentials, socialAuth: boolean) => void;
    signInWithSocial: (form: any, provider: string) => void;

    /**
     * LoginController class constructor
     * @param Session  comment about Session parameter
     * @param appName  The application name to show during login
     */
    constructor($scope, $timeout, $state, $stateParams, $location, Session, appName: string, appSocialAuth) {
        this.appName = appName;
        this.credentials = {
            username: '',
            password: ''
        };
        this.socialAuthAllowed = appSocialAuth;

        this.authenticate = async (form: any, credentials: Credentials, socialAuth: boolean = false) => {
            try {
                await Session.authenticate(credentials, socialAuth);

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

        this.signInWithSocial = (form: any, provider: string) => {
            let providers = {
                'google': new firebase.auth.GoogleAuthProvider(),
                'github': new firebase.auth.GithubAuthProvider(),
            };
            firebase.auth().signInWithPopup(providers[provider]).then((result) => {
                firebase.auth().currentUser.getToken(true).then((idToken) => {
                  this.authenticate(form, {'username': result.user.uid, 'password': idToken}, true);
                }).catch(function(error) {
                  console.log(error);
                });
            }).catch(function(error) {
                console.log(error);
            });
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
