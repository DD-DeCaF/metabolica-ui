import angular from "angular";

/**
 *
 * This is a service for transferring items between components
 *
 */

function $sharingProvider() {
    let registry = [];

    return {
        register(state, {name, accept = []} = {}) {
            registry.push({state, name, accept});
        },

        $get: ['$state', '$rootScope', function ($state) {
            let provided = {};
            let transfer = {};
            let hooks = [];

            class Sharing {
                get registry() {
                    return registry;
                }

                items(type, otherwise = []) {
                    let values = transfer[type];
                    if (values instanceof Array) {
                        transfer = Object.assign({}, transfer, {type: undefined});
                        return values;
                    } else if (values !== undefined) {
                        transfer = Object.assign({}, transfer, {type: undefined});
                        return [values];
                    } else {
                        return otherwise;
                    }
                }

                item(type, otherwise = null) {
                    let value = transfer[type];
                    if (!(value === undefined || value instanceof Array)) {
                        transfer = Object.assign({}, transfer, {type: undefined});
                        return value;
                    } else {
                        return otherwise;
                    }
                }

                provide(shareable) {
                    provided = Object.assign({}, provided, shareable);
                    this._triggerOnShareChange();
                }

                clearProvisions() {
                    provided = {};
                    this._triggerOnShareChange();
                }

                onShareChange(hookFn) {
                    hooks.push(hookFn);
                }

                _triggerOnShareChange() {
                    let targets = this.targets;
                    for (let hookFn of hooks) {
                        hookFn(targets);
                    }
                }

                get targets() {
                    return registry.filter(({_name, accept}) =>
                        accept.some(({type, multiple}) => provided[type] !== undefined && (multiple || !(provided[type] instanceof Array))));
                }

                findTargets(provides, isMultiple = false) {
                    return registry.filter(({_name, accept, state}) =>
                        !$state.includes(state) && accept.some(({type, multiple}) => type === provides && (multiple || !isMultiple)));
                }

                // TODO transfer to $stateParams if receiving state supports it (needs to be specified on register).
                async open(state) {
                    transfer = provided;
                    await $state.go(state);
                    transfer = {};
                }

                async share(type, itemOrItems, targetState) {
                    provided = {[type]: itemOrItems};
                    await this.open(targetState);
                }
            }

            return new Sharing();
        }]
    };
}


class ShareButtonController {
    targets = [];

    constructor($sharing) {
        this._sharing = $sharing;
    }

    $onChanges(changes) {
        if (changes.items.currentValue) {
            this.targets = this._sharing.findTargets(this.provides, changes.items.currentValue instanceof Array);
        } else {
            this.targets = [];
        }
    }

    shareWith(target) {
        this._sharing.share(this.provides, this.items, target.state);
    }
}

export const SharingModule = angular.module('SharingModule', [])
    .component('shareButton', {
        template: `<md-menu ng-show="$ctrl.targets.length" md-position-mode="target-right target">
						<md-button class="md-icon-button" ng-click="$mdOpenMenu($event)">
							<md-icon md-svg-icon="share"></md-icon>
						</md-button>
						<md-menu-content width="4">
							<md-menu-item ng-repeat="target in $ctrl.targets">
								<md-button ng-click="$ctrl.shareWith(target)">
									<div layout="row">
										<p flex>{{ target.name }}</p>
										<md-icon md-svg-icon="share" md-menu-align-target></md-icon>
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
    .provider('$sharing', $sharingProvider)
    .run(function ($transitions) {
        $transitions.onStart({}, transition => {
            const $sharing = transition.injector().get('$sharing');
            $sharing.clearProvisions();
        });
    });
