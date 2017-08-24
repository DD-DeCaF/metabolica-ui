import angular from 'angular';
import maintenanceDialogTemplate from './maintenance.dialog.html';

function HttpInterceptorFactory($q, $rootScope, httpBuffer) {
    return {
        responseError(rejection) {
            switch (rejection.status) {
                case 502:
                case 503:
                {
                    let deferred = $q.defer();
                    httpBuffer.append(rejection.config, deferred);
                    $rootScope.$broadcast('event:http-maintenance', rejection);
                    return deferred.promise;
                }
            }

            return $q.reject(rejection);
        }
    };
}

/*
 * Copyright (c) 2012 Witold Szczerba
 * License under licenses/LICENSE-httpBuffer
 */
function HttpBufferFactory($injector) {
    /** Holds all the requests, so they can be re-requested in future. */
    let buffer = [];

    /** Service initialized later because of circular dependency problem. */
    let $http;

    function retryHttpRequest(config, deferred) {
        function successCallback(response) {
            deferred.resolve(response);
        }

        function errorCallback(response) {
            deferred.reject(response);
        }

        $http = $http || $injector.get('$http');
        $http(config).then(successCallback, errorCallback);
    }

    return {
        /**
         * Appends HTTP request configuration object with deferred response attached to buffer.
         */
        append(config, deferred) {
            buffer.push({
                config,
                deferred
            });
        },

        /**
         * Abandon or reject (if reason provided) all the buffered requests.
         */
        rejectAll(reason) {
            if (reason) {
                for (let i = 0; i < buffer.length; ++i) {
                    buffer[i].deferred.reject(reason);
                }
            }
            buffer = [];
        },

        /**
         * Retries all the buffered requests clears the buffer.
         */
        retryAll(updater) {
            for (let i = 0; i < buffer.length; ++i) {
                retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
            }
            buffer = [];
        }
    };
}

export const MaintenanceModule = angular.module('shared.maintenance', [])
    .factory('httpInterceptor', HttpInterceptorFactory)
    .factory('httpBuffer', ['$injector', HttpBufferFactory])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    })
    .run(function ($rootScope, $mdDialog, httpBuffer) {
        let maintenanceDialogIsOpen = false;

        $rootScope.$on('event:http-maintenance', () => {
            if (!maintenanceDialogIsOpen) {
                maintenanceDialogIsOpen = true;

                $mdDialog.show({
                    controller($scope, appName) {
                        $scope.appName = appName;
                        $scope.retry = () => {
                            httpBuffer.retryAll(config => config);

                            $mdDialog.hide();
                            maintenanceDialogIsOpen = false;
                        };
                    },
                    template: maintenanceDialogTemplate,
                    parent: angular.element(document.body),
                    clickOutsideToClose: false
                });
            }
        });
    });

