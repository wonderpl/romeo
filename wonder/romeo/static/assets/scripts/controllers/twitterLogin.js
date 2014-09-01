angular
  .module('RomeoApp.controllers')
  .controller('TwitterLoginCtrl', ['$scope', '$location', 'SecurityService', 'AccountService',
  	function ($scope, $location, SecurityService, AccountService) {
  		'use strict';
  		$scope.isLoading = false;
  		$scope.profile = $scope.profile || {};

		$scope.save = function() {
			$scope.errors = '';

			externalLogin($scope.profile);
		};

		function externalLogin(profile) {
			SecurityService.ExternalLogin(profile).then(function (response) {
	        	$location.url('/organise');
	        },
	        function (response) {
	        	if (response.data.error == 'registration_required') {
	        		// Do nothing, just show this page
	        	} else if (response.data.form_errors && response.data.form_errors.username) {
					$scope.errors = response.data.form_errors.username[0];
				} else {
	        		alert("Something went wrong with your sign in:\n" + response.data);
        		}
	        }
	      );
		}
  }]
);