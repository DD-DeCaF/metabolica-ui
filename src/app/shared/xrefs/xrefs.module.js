import angular from 'angular';
import {XRefMenuComponent} from './xref-menu.component';
import {XRefComponent} from './xref.component';
import './xrefs.scss';


class XRefRegistryProvider {
    constructor() {
        this.sources = {};
    }

    // XXX is component needed?
    register(type, config) {
        if (typeof type === 'string') {
            this.sources[type] = config;
        } else if (type.constructor.name) {
            this.sources[type.constructor.name] = config;
        }
    }

    $get() {
        return this.sources;
    }
}


export const XRefsModule = angular.module('xrefs', ['ngMaterial'])
    .provider('xrefRegistry', XRefRegistryProvider)
    .factory('xrefMenuPanel', function ($transitions, $mdPanel, xrefRegistry) {
        $transitions.onStart({}, () => {
            closeMenus();
        });

        let menus = [];
        function closeMenus() {
            for (let menu of menus) {
                menu.close();
            }

            menus = [];
        }

        return function (event, item, type) {
            let config;
            if (!type) {
                type = item.constructor.name;
            }

			if (xrefRegistry[type]) {
				config = xrefRegistry[type](item);
			}

            if (!config) {
                return;
            }

            let animation = $mdPanel.newPanelAnimation()
                .withAnimation($mdPanel.animation.FADE);

            let position = $mdPanel.newPanelPosition()
                .relativeTo(event.target)
                .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW)
                .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.ABOVE)
                .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.CENTER)
                .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW)
                .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.ABOVE)
                .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.CENTER);

            $mdPanel.open(Object.assign({
                animation,
                attachTo: angular.element(document.body),
                controllerAs: '$ctrl',
                panelClass: 'xref-menu md-whiteframe-3dp',
                position,
                openFrom: event,
                clickOutsideToClose: true,
                escapeToClose: true,
                focusOnOpen: false,
                zIndex: 89
            }, config)).then(menu => {
                menus.push(menu);
            });
        };

    })
    .component('xrefMenu', XRefMenuComponent)
	.component('xref', XRefComponent);
