/*
* Directive that automatically focusses on an input field when it is linked
*/
angular.module('RomeoApp.directives').directive('plFocusField', ['$timeout', function($timeout){

    'use strict';

    return {
        restrict: 'A',
        link: function(scope, elem, attrs){
            $timeout(function(){
                elem[0].focus();
            });
        }
    };
}]);