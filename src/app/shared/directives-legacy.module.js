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

import angular from 'angular';
// TODO(lars) find better location for these

export const DirectivesModule = angular
    .module('common.directives', [])
    .directive('user', UserDirective)
    .directive('date', DateDirective)
    .directive('poolLink', PoolLinkDirective)
    .directive('strainLink', StrainLinkDirective)
    .directive('historyBack', HistoryBackDirective)
    .directive('organism', OrganismDirective);


function UserDirective() {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: '<span><md-tooltip>{{ user.displayName }} <span ng-if="user.title">({{ user.title }})</span></md-tooltip> {{ user.shortFullName() }}</span>',
        controller($q, $scope) {
            $scope.$watch('value', () => {
                $q.when($scope.value).then(user => {
                    $scope.user = user;
                });
            });
        }
    };
}

function DateDirective() {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: '<span><md-tooltip>{{ value | date:"fullDate" }}</md-tooltip> {{ value | date:"mediumDate" }}</span>'
    };
}


function PoolLinkDirective() {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: '<a ui-sref="app.project.pool({poolId: value.id})">{{ value.identifier }}</a>'
    };
}


function StrainLinkDirective() {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: '<a ui-sref="app.project.strain({strainId: value.id})">{{ value.identifier }}</a>'
    };
}


function OrganismDirective() {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: `<em ng-bind="value.name"></em><span ng-if="value.alternateName"> ({{ value.alternateName }})</span>`
    };
}

function HistoryBackDirective($window) {
    return {
        restrict: 'A',
        link(scope, element) {
            element.one('click', () => $window.history.back());
        }
    };
}
