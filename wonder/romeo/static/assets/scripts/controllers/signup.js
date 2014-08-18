angular
  .module('RomeoApp.controllers')
  .controller('SignupCtrl', function($scope, $location, AuthService) {
  	'use strict';

	  $scope.username = $scope.username || '';
	  $scope.password = $scope.password || '';
	  $scope.name = $scope.name || '';
	  $scope.location = 'GB';
	  $scope.tandc = false;

  	$scope.signUp = function() {
  		return; //AuthService.
  	};
    $scope.validate = function() {
      $scope.errorMessage = 'Password required';
      return false;
    };
  });