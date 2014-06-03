angular.module('RomeoApp.directives').directive('plToolbarDropdown', [function(){
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

            scope.$on('dropdown-enabled', function(event){
                elem[0].disabled = false;
            });

            scope.$on('dropdown-disabled', function(event){
                elem[0].disabled = true;
            });

        }
    };
}]);