angular.module('RomeoApp.analytics').directive('plAnalyticsResultsTable', ['$rootScope', function ($rootScope) {

    'use strict';

    return {
        restrict: 'A',
        templateUrl: '/static/views/directives/analytics-results-table.html',
        controller: function ($scope) {

        }
    };
}]);