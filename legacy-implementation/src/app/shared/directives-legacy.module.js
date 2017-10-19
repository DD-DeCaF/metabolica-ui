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
