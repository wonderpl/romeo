angular.module('RomeoApp.analytics').directive('plAnalyticsOverview', ['$rootScope', '$timeout', 'OverviewService', function ($rootScope, $timeout, OverviewService) {

    'use strict';

    return {
        restrict: 'A',
        templateUrl: '/static/views/directives/analytics-overview.html',
        scope: true,
        controller: function ($scope) {

            $scope.overview = {};

            OverviewService.get($scope.analytics.video.videoID).then(function (data) {
                $scope.overview.data = data;
            });

        }
    };
}]);