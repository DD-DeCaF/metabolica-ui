import {XRefMenuComponent} from './xref-menu.component';
import {XRefComponent} from './xref.component';
import './xrefs.scss';


class XRefRegistryProvider {
    constructor() {
        this.sources = {};
    }

    // XXX is component needed?
    register(resource, config) {
        this.sources[resource] = config
    }

    $get() {
        return this.sources;
    }
}


export const XRefsModule = angular.module('xrefs', ['ngMaterial'])
    .provider('xrefRegistry', XRefRegistryProvider)
    .factory('xrefMenuPanel', function ($rootScope, $mdPanel, xrefRegistry) {
        $rootScope.$on('$stateChangeStart', closeMenus);

        let menus = [];
        function closeMenus() {
            for(let menu of menus) {
                menu.close();
            }

            menus = [];
        }

        return function (item, event) {
            let config;

			console.log(item, item.constructor.name, item.constructor)

			if(xrefRegistry[item.constructor.name]) {
				config = xrefRegistry[item.constructor.name](item)
			}

            if(!config) {
                return
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
                animation: animation,
                attachTo: angular.element(document.body),
                controllerAs: '$ctrl',
                panelClass: 'xref-menu md-whiteframe-3dp',
                position: position,
                openFrom: event,
                clickOutsideToClose: true,
                escapeToClose: true,
                focusOnOpen: false,
                zIndex: 89
            }, config)).then((menu) => {menus.push(menu)})
        }

    })
    .component('xrefMenu', XRefMenuComponent)
	.component('xref', XRefComponent);
