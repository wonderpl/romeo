angular.module('RomeoApp.analytics').directive('plAnalyticsOverviewWidget', function () {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/static/views/directives/analytics-widget.html',
        scope: {
            data: '='
        },
        controller: function ($scope) {
            $scope.$watch('data', function (data) {
                if (_.isArray(data)) {
                    $scope.viewModel = {
                        primary: $scope.data[0],
                        secondary: $scope.data.slice(1)
                    };
                }
            });

        }
    };
});