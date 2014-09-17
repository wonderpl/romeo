(function () {
    'use strict';
    var debug = new DebugClass('RomeoApp.analytics');


    function AnalyticsRouteProvider($routeProvider, securityAuthorizationProvider) {
        // Account management
        $routeProvider.when('/analytics', {
            templateUrl: 'analytics/analytics.tmpl.html',
            controller: 'AnalyticsCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });
    }

    angular.module('RomeoApp.analytics').config(['$routeProvider', 'securityAuthorizationProvider', AnalyticsRouteProvider]);


    function AnalyticsCtrl($scope) {
        $scope.demoData = [
            {
                key: "Video views",
                values: [
                    ["Monday", 78],
                    ["Tuesday", 60],
                    ["Wednesday", 75],
                    ["Thursday", 75],
                    ["Friday", 50],
                    ["Saturday", 40],
                    ["Sunday", 62]]
            }
        ];
        $scope.demoDataColor = function () {
            return function(d, i) {
                return '#52b565';
            };
        };

        function init() {

        }

        init();
    }
    angular.module('RomeoApp.analytics').controller('AnalyticsCtrl', ['$scope', AnalyticsCtrl]);

})();
