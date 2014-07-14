/*
* Used on the old manage prototype for showing which collections the videos were in
*/
angular.module('RomeoApp.directives').directive('plTooltip', ['$tooltip', function($tooltip){
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, elem, attrs){
            elem.bind('mouseenter', function(e){
                if ( attrs.plTooltip.length > 0 ) {
                    $tooltip.show(attrs.plTooltip, elem[0]);
                }
            });
            elem.bind('mouseleave', function(e){
                $tooltip.hide();
            });
        }
    };
}]);