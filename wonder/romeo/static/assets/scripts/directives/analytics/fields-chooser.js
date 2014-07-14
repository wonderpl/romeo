angular.module('RomeoApp.analytics').directive('plAnalyticsFieldsChooser', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    'use strict';

    return {
        restrict: 'A',
        templateUrl: '/static/views/directives/analytics-fields-chooser.html',
        controller: function ($scope) {

        }
    };
}]);