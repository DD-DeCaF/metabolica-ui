import angular from 'angular';
/**
 *
 * This is a service for transferring items between components
 *
 */

function $sharingProvider() {
    let registry = [];

    return {

        register(state, {name, accept = []} = {}) {
            registry.push({state, name, accept})
        },

        $get: ['$state', '$rootScope', function ($state, $rootScope) {
            let provided = {}, transfer = {};

            class Sharing {

                items(type, otherwise = []) {
                    let values = transfer[type];
                    if (values instanceof Array) {
                        transfer = {};
                        return values;
                    } else if (values != undefined) {
                        transfer = {};
                        return [values];
                    } else {
                        return otherwise;
                    }
                }

                item(type, otherwise = null) {
                    let value = transfer[type];
                    if (!(value == undefined || value instanceof Array)) {
                        transfer = {};
                        return value;
                    } else {
                        return otherwise;
                    }
                }

                provide(scope, sharable) {
                    for (let type of Object.keys(sharable)) {
                        let watchExpression = sharable[type];

                        scope.$watch(watchExpression, (value) => {
                            if (value != undefined) {
                                provided[type] = value;
                            } else {
                                delete provided[type];
                            }

                            $rootScope.$broadcast('share-change', this.targets);
                        });


                    }

                    scope.$on('$destroy', function () {
                        provided = {};
                        $rootScope.$broadcast('share-change', []);
                    });
                }

                get targets() {
                    return registry.filter(({name, accept}) =>
                        accept.some(({type, multiple}) => provided[type] != undefined && (multiple || !(provided[type] instanceof Array))))
                }

                findTargets(provides, isMultiple = false) {
                    return registry.filter(({name, accept, state}) =>
                    !$state.includes(state) && accept.some(({type, multiple}) => type == provides && (multiple || !isMultiple)));
                }

                // TODO transfer to $stateParams if receiving state supports it (needs to be specified on register).
                async open(state) {
                    transfer = provided;
                    await $state.go(state);
                    transfer = {};
                }

                async share(type, itemOrItems, targetState) {
                    provided = {[type]: itemOrItems};
                    await this.open(targetState)
                }
            }

            return new Sharing()
        }]
    }
}


class ShareButtonController {
    targets = [];

    constructor($sharing) {
        this._sharing = $sharing;
    }

    $onChanges(changes) {
        if (changes.items.currentValue) {
            this.targets = this._sharing.findTargets(this.provides, changes.items.currentValue instanceof Array)
        } else {
            this.targets = [];
        }
    }

    shareWith(target) {
        this._sharing.share(this.provides, this.items, target.state)
    }
}

export const SharingModule = angular.module('SharingModule', [])
    .component('shareButton', {
        template: `<md-menu ng-show="$ctrl.targets.length" md-position-mode="target-right target">
						<md-button class="md-icon-button" ng-click="$mdOpenMenu($event)">
							<md-icon>share</md-icon>
						</md-button>
						<md-menu-content width="4">
							<md-menu-item ng-repeat="target in $ctrl.targets">
								<md-button ng-click="$ctrl.shareWith(target)">
									<div layout="row">
										<p flex>{{ target.name }}</p>
										<md-icon md-menu-align-target>share</md-icon>
									</div>
								</md-button>
							</md-menu-item>
						</md-menu-content>
					</md-menu>`,
        controller: ShareButtonController,
        bindings: {
            provides: '@',
            items: '<'
        }

    })
    .provider('$sharing', $sharingProvider);
