//fullscreen-modal.js

(function () {
'use strict';

function FullScreenModal (modal) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attr) {
            element.on('click', function () {
                modal.loadDirective(attr.fullscreenModal, scope);
            });
        }
    };
}

angular.module('RomeoApp.directives')
  .directive('fullscreenModal', ['modal', FullScreenModal]);
})();