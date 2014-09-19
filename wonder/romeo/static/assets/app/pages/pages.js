// pages.js
(function () {
    'use strict';
    var debug = new DebugClass('RomeoApp.pages');

    function StaticPagesCtrl($scope, SecurityService) {
        function init() {
            $scope.isAuthenticated = SecurityService.isAuthenticated();
            $scope.display_name = SecurityService.getUser() ? SecurityService.getUser().display_name : '';
        }

        $scope.$watch(function () {
            return SecurityService.isAuthenticated();
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.isAuthenticated = SecurityService.isAuthenticated();
                $scope.display_name = SecurityService.getUser() ? SecurityService.getUser().display_name : '';
            }
        });

        init();
    }
    angular.module('RomeoApp.pages').controller('StaticPagesCtrl', ['$scope', 'SecurityService', StaticPagesCtrl]);

})();
