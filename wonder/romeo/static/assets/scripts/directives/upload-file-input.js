/*
* Deprecated
*/
angular.module('RomeoApp.directives').directive('uploadFileInput', ['$timeout', '$rootScope', function($timeout, $rootScope){
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, elem, attrs){

            elem.bind('change', function(e){
                $rootScope.$broadcast('fileSelected', e, elem);
            });
        }
    };
}]);