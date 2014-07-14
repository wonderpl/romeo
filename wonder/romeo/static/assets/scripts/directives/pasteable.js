angular.module('RomeoApp.directives').directive('pasteable', ['$rootScope', '$timeout', function($rootScope, $timeout){

    'use strict';

    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.bind('paste', function(e) {
                console.log(e);
                // var StrippedString = OriginalString.replace(/(<([^>]+)>)/ig,"");
            });
        }
    };
}]);