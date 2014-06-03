/*
* Description: Used on the account page to prohibit users from putting single line fields onto more than one line
* Used on: Input fields
*/
angular.module('RomeoApp.directives').directive('disableNewLines', ['$rootScope', function($rootScope){

    'use strict';

    return {
        restict: 'A',
        link: function(scope, elem, attrs) {
            elem.on('keydown', function(e){
                if ( e.keyCode === 13 ) {
                    e.preventDefault();
                }
            });
        }
    };
}]);