
angular
  .module('RomeoApp.controllers')
  .controller('LoginCtrl', LoginController);

function LoginController ($scope, $location, AuthService) {
  'use strict';

  $scope.username = $scope.username || '';
  $scope.password = $scope.username || '';
  $scope.href = '';
  $scope.tandc = false;
  $scope.isLoading = {};

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
    $scope.isLoading.login = true;
    return AuthService.login($scope.username, $scope.password).then(
    $scope.handleRedirect,
    function (response) {
      console.log(response);
      $scope.isLoading.login = false;
      if (response.data.error) {
        $scope.errors = 'login error';
      }
    });
  };

  $scope.disableButtons = function () {
    var state = false;
    angular.forEach($scope.isLoading, function(value, key) {
      if (value)
        state = true;
    });
    return state;
  };

  $scope.showSignup = function () {
    $location.url('/signup');
  };
  $scope.showTwitterSignin = function () {
    window.open('/auth/twitter_redirect?callback=/app#/twitter-login', 'twitter_signin', 'width=560, height=360');
  };

}