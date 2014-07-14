/*
* A way of disabling input fields via a class of 'disabled' - used to avoid browser conflicts with the disabled attribute
*/
angular.module('RomeoApp.directives').directive('plDisabled', [function(){

    'use strict';

    return {
        restrict: 'C',
        link: function(scope, elem, attrs){
            elem.bind('focus', function(e){
                elem[0].blur();
            });
        }
    };
}]);