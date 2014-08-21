angular.module('RomeoApp.analytics').directive('plAnalyticsFieldsKey', ['$rootScope', function ($rootScope) {

    'use strict';

    return {
        restrict: 'A',
        templateUrl: '/static/views/directives/analytics-fields-key.html',
        controller: function ($scope) {

        }
    };
}]);