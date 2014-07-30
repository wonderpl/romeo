angular.module('RomeoApp.controllers').controller('LoginCtrl',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {

            'use strict';

            $scope.username = $scope.username || '';
            $scope.password = $scope.username || '';
            $scope.href = '';

            $scope.handleRedirect = function (response) {
                var params = $location.search();
                if (params.redirect) {
                    console.log('redirect to ->' + params.redirect);
                } else {
                    $location.url('/organise');
                }
            };

            $scope.login = function () {
                return AuthService.login($scope.username, $scope.password).then($scope.handleRedirect,
                  function (response) {
                    // Error Logging in
                    console.log(response);

                    if (response.data.error) {

                      $scope.errors = 'login error';
                    };
                });
            };

        }
    ]
);
