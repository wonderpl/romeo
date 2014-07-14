angular.module('RomeoApp.analytics').directive('plAnalyticsResultsTable', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    'use strict';

    return {
        restrict: 'A',
        templateUrl: '/static/views/directives/analytics-results-table.html',
        controller: function ($scope) {

        }
    };
}]);