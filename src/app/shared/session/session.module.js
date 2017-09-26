import angular from 'angular';
import 'ngstorage';

import {ResourcesModule} from '../resources/resources.module';


function SessionFactory($http, $localStorage, $rootScope, $q, User, Policy, potion) {
    let permissionsCache = {};

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
            return $http.post(`${potion.host}${potion.prefix}/auth`, credentials)
                .then(response => {
                    $localStorage.sessionJWT = response.data.token;
                    permissionsCache = {};
                    $rootScope.$broadcast('session:login');
                });
        },

        logout(next = null) {
            delete $localStorage.sessionJWT;
            permissionsCache = {};
            $rootScope.$broadcast('session:logout', {next});
        },

        login(next = null) {
            $rootScope.$broadcast('session:logout', {next});
        },

        testPermissions(permissions) {
            permissions = JSON.stringify(permissions);

            return $q((resolve, reject) => {
                if (!this.isAuthenticated()) {
                    resolve(false);
                    return;
                }

                if (permissionsCache[permissions]) {
                    resolve(permissionsCache[permissions]);
                    return;
                }

                Policy.testPermissions({permissions}).then(allowedPermissions => {
                    permissionsCache[permissions] = !!allowedPermissions.length;
                    resolve(permissionsCache[permissions]);
                }).catch(() => {
                    resolve(false);
                });
            });
        },

        testProjectPermissions(project, permissions) {
            permissions = JSON.stringify(permissions);
            const cacheKey = `${project.id}-${permissions}`;

            return $q((resolve, reject) => {
                if (!this.isAuthenticated()) {
                    resolve(false);
                    return;
                }

                if (permissionsCache[cacheKey]) {
                    resolve(permissionsCache[cacheKey]);
                    return;
                }
                Policy.testProjectPermissions({project, permissions}).then(allowedPermissions => {
                    permissionsCache[cacheKey] = !!allowedPermissions.length;
                    resolve(permissionsCache[cacheKey]);
                }).catch(() => {
                    resolve(false);
                });
            });
        }
    };

    return Session;
}


function SessionInterceptorFactory($q, $injector, appAuth) {
    return {
        request(config) {
            let $localStorage = $injector.get('$localStorage');

            // Authorization header should be passed to trusted hosts only
            if ($localStorage.sessionJWT && appAuth.isTrustedURL(config.url)) {
                config.headers.Authorization = `Bearer ${$localStorage.sessionJWT}`;
            }
            return config;
        },
        responseError(response) {
            if (response.status === 401) {
                // TODO: fix backend to respond to unauthorised user
                if (appAuth.isRequired) {
                    $injector.get('Session').logout(location.pathname);
                }
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
    .run(function ($rootScope, $state, $location, $log, $mdDialog, Session, Project, appAuth) {
        $rootScope.$on('session:login', () => {
            $rootScope.isAuthenticated = true;
        });

        $rootScope.$on('session:logout', (event, options) => {
            $state.go('login', options);
        });

        if (!Session.isAuthenticated()) {
            $rootScope.isAuthenticated = false;
            if (appAuth.isRequired) {
                setTimeout(() => {
                    let next;
                    if (!$state.includes('login')) {
                        next = $location.path();
                    }
                    $rootScope.$broadcast('session:logout', {next});
                }, 100);
            }
        } else {
            $rootScope.isAuthenticated = true;
            $log.info(`Session expires ${Session.expires}`);
        }
    });
