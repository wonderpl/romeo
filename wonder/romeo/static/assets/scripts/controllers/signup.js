angular
  .module('RomeoApp.controllers')
  .controller('SignupCtrl', ['$scope', 'AuthService',
    function($scope, AuthService) {
  	'use strict';

	  $scope.username = $scope.username || '';
	  $scope.password = $scope.password || '';
	  $scope.name = $scope.name || '';
	  $scope.location = 'GB';
	  $scope.tandc = false;
    $scope.isLoading = false;

    $scope.handleRedirect = function (response) {
      $scope.isLoading = false;
      var params = $location.search();
      if (params.redirect) {
        console.log('redirect to ->' + params.redirect);
      } else {
        $location.url('/organise');
      }
    };

  	$scope.signUp = function() {
      if ( validate() ) {
        $scope.isLoading = true;
        var user = {
          "username": $scope.username,
          "password": $scope.password,
          "name": $scope.name,
          "location": $scope.location
        };
        
        AuthService.registration(user).then(
          $scope.handleRedirect,
          function (response) {
            console.log(response);
            $scope.isLoading = false;
            if (response.data.error) {
              $scope.errorMessage = 'login error';
            }
          });
        return true;
      }
  		return false;
  	};

    function validate() {
      if (! $scope.name) {
        $scope.errorMessage = 'Name required';
      } else if (! $scope.username || $scope.username.indexOf('@') == -1) {
        $scope.errorMessage = 'Email required';
      } else if (! $scope.password) {
        $scope.errorMessage = 'Password required';
      } else if (! $scope.tandc) {
        $scope.errorMessage = 'You have to agree to the Terms and Conditions';
      } else {
        $scope.errorMessage = void(0);
      }
      return (typeof $scope.errorMessage === 'undefined');
    }
  }]);