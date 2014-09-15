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
        function init() {

        }

        init();
    }
    angular.module('RomeoApp.analytics').controller('AnalyticsCtrl', ['$scope', AnalyticsCtrl]);

})();