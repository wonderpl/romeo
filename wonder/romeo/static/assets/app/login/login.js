
angular
  .module('RomeoApp.login')
  .controller('LoginCtrl', ['$scope', '$location', 'SecurityService', LoginController]);

function LoginController ($scope, $location, SecurityService) {
  'use strict';

  $scope.username = $scope.username || '';
  $scope.password = $scope.username || '';
  $scope.href = '';
  $scope.tandc = false;
  $scope.isLoading = {};

  $scope.login = function () {
    $scope.isLoading.login = true;
    return SecurityService.login($scope.username, $scope.password).then(
      function (data) {
        $scope.isLoading.login = false;
        console.info('Login successful');
        SecurityService.restoreUrl();
      },
      function (response) {
        console.log(response);
        $scope.isLoading.login = false;
        if (response.data.error && response.data.error == 'invalid_request') {
          $scope.errors = 'Invalid email or password';
        }
        else if (response.data.error) {
          $scope.errors = 'login error: ' + response.data.error;
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
      SecurityService.setExternalCredentials(data.credentials);

      // Then call external login to see if we need to ask for email
      SecurityService.ExternalLogin().then(function (response) {
          console.log('Success in request');
          console.dir(response.data);
          SecurityService.restoreUrl('/profile');
        },
        function (response) {
          console.log('Error in request');
          console.dir(response.data);
          if (response.data.error == 'registration_required') {
            $location.url('/login/twitter');
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