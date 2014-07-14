angular.module('RomeoApp.directives').directive('plLoader', function () {

    'use strict';

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="pl-loader loading"></div>'
    };
});