angular.module('RomeoApp.directives').directive('quickShareRecipients', ['$rootScope', '$timeout', '$templateCache', function($rootScope, $timeout, $templateCache) {

    'use strict';

    return {
        restrict: 'A',
        template: $templateCache.get('upload-quick-share-recipients.html'),
        link: function (scope, elem, attrs) {
            console.log('recipients initialised');
        }
    };
}]);