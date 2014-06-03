angular.module('RomeoApp.analytics').directive('plAnalyticsWidgetStatistic', ['$rootScope', '$timeout', function () {

    'use strict';

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/static/views/directives/analytics-widget-statistic.html',
        scope: {
            datum: '='
        }
    };
}]);