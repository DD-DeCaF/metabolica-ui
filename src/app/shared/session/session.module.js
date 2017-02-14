import angular from 'angular';
import 'ngstorage';

import {ResourcesModule} from '../resources/resources.module';


function SessionFactory($http, $localStorage, $rootScope, User) {
    const Session = {
        isAuthenticated() {
            return this.expires > new Date();
        },

        get expires() {
            if ($localStorage.sessionJWT) {
                try {
                    return new Date(JSON.parse(atob($localStorage.sessionJWT.split('.')[0])).exp * 1000);
                } catch (e) {
                    return new Date(0);
                }
            } else {
                return new Date(0);
            }
        },

        get _attributes() {
            if ($localStorage.sessionJWT) {
                try {
                    return JSON.parse(atob($localStorage.sessionJWT.split('.')[1]));
                } catch (e) {
                    return {};
                }
            } else {
                return {};
            }
        },

        getCurrentUser() {
            if (!this.isAuthenticated()) {
                return null;
            }

            let attrs = this._attributes;
            if (attrs.userId) {
                return User.fetch(attrs.userId, {cache: false});
            } else {
                return User.current();
            }
        },

        authenticate(credentials) {
            return $http.post('/api/auth', credentials)
                .then((response) => {
                    $localStorage.sessionJWT = response.data.token;
                    $rootScope.$broadcast('session:login');
                });
        },

        logout(next = null) {
            delete $localStorage.sessionJWT;
            $rootScope.$broadcast('session:logout', {next: next});
        }
    };

    return Session;
}


function SessionInterceptorFactory($q, $injector) {
    return {
        request(config) {
            let $localStorage = $injector.get('$localStorage');
            if ($localStorage.sessionJWT) {
                config.headers.Authorization = `Bearer ${$localStorage.sessionJWT}`;
            }
            return config;
        },
        responseError(response) {
            if (response.status === 401) {
                $injector.get('Session').logout(location.pathname);
            }
            return $q.reject(response);
        }
    };
}

export const SessionModule = angular
    .module('common.session', [
        ResourcesModule.name,
        'ngStorage'
    ])
    .factory('Session', SessionFactory)
    .factory('sessionInterceptor', SessionInterceptorFactory)
    .run(function ($rootScope, $state, $location, $log, $mdDialog, Session, Project) {
        $rootScope.$on('session:login', (event) => {
            $rootScope.isAuthenticated = true;
        });

        $rootScope.$on('session:logout', (event, options) => {
            $state.go('login', options);
        });

        if(!Session.isAuthenticated()) {
            $rootScope.isAuthenticated = false;
            setTimeout(() => {
                let next;
                if (!$state.includes('login')) {
                    next = $location.path();
                }
                $rootScope.$broadcast('session:logout', {next});
            }, 100);
        } else {
            $rootScope.isAuthenticated = true;
            $log.info(`Session expires ${Session.expires}`);
        }
    });
