
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
    window.open('/auth/twitter_redirect?callback=twitterAuthCallback', 'twitter_signin', 'width=560, height=360');
  };
  $scope.twitterCallback = function(data) {
    $scope.isLoading.twitter = false;
    if (data.error) {
      alert(data.error);
    } else {
      console.dir(data);
      // First set the credentials recieved from twitter
      AuthService.setExternalCredentials(data.credentials);

      // Then call external login to see if we need to ask for email
      AuthService.ExternalLogin().then(function (response) {
          console.log('Success in request');
          console.dir(response.data);
          $location.url('/organise');
        },
        function (response) {
          console.log('Error in request');
          console.dir(response.data);
          if (response.data.error == 'registration_required') {
            $location.url('/twitter-login');
          } else {
            alert("Something went wrong with your sign in:\n" + data);
          }
        }
      );
    }
  };
}

function twitterAuthCallback(result) {
  'use strict';
  console.log(result);
  var scope = angular.element(document.getElementById('loginController')).scope();
  scope.twitterCallback(result);
  scope.$apply();
}