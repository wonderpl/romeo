angular.module('RomeoApp.analytics').directive('plAnalyticsFieldsKey', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    'use strict';

    return {
        restrict: 'A',
        templateUrl: '/static/views/directives/analytics-fields-key.html',
        controller: function ($scope) {

        }
    };
}]);