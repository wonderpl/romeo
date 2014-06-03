angular.module('RomeoApp.directives').directive('quickShare', ['$rootScope', '$timeout', '$templateCache', function($rootScope, $timeout, $templateCache) {
    'use strict';
    return {
        restrict: 'E',
        template: $templateCache.get('upload-quick-share.html'),
        link: function (scope, elem, attrs) {
        }
    };
}]);