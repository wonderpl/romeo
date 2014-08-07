
angular
  .module('RomeoApp.controllers')
  .controller('LoginCtrl', LoginController);

function LoginController ($scope, $location, AuthService) {

  'use strict';

  $scope.username = $scope.username || '';
  $scope.password = $scope.username || '';
  $scope.href = '';
  $scope.tandc = false;

  $scope.handleRedirect = function (response) {
    $scope.isLoading = false;
    var params = $location.search();
    if (params.redirect) {
      console.log('redirect to ->' + params.redirect);
    } else {
      $location.url('/organise');
    }
  };

  $scope.login = function () {
    return AuthService.login($scope.username, $scope.password).then(
    $scope.handleRedirect,
    function (response) {
      console.log(response);
      $scope.isLoading = false;
      if (response.data.error) {
        $scope.errors = 'login error';
      }
    });
  };

}