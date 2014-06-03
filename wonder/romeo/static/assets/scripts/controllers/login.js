angular.module('RomeoApp.controllers').controller('LoginCtrl',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            'use strict';

            $scope.username = $scope.username || '';
            $scope.password = $scope.username || '';
            $scope.href = '';

            $scope.handleRedirect = function () {
                var params = $location.search();
                if (params.redirect) {
                    console.log('redirect to ->' + params.redirect);
                } else {
                    $location.url('/upload');
                }
            };

            $scope.login = function () {
                return AuthService.login($scope.username, $scope.password).then($scope.handleRedirect, function () {
                    // Error Logging in
                });
            };

        }
    ]
);
