angular
  .module('RomeoApp.controllers')
  .controller('TwitterLoginCtrl', ['$scope', 'AuthService',
  	function ($scope, AuthService) {
  		'use strict';

  		$scope.isLoading = false;

		function loginOrSignup() {
			AccountService.findUsernameByExternalToken('twitter', $scope.credentials.externalToken).then(function (data) {
				AuthService.ExternalLogin({
					external_system: "twitter",
					external_token: $scope.credentials.externalToken,
					username: data,
					location: 'GB'
				}).then(function () {
					$location.redirect('/organise');
				});
			},
			function () {
				// User not found, register
			});
		}

		$scope.save = function() {
			$scope.errors = '';
			AuthService.ExternalLogin({
				external_system: "twitter",
				external_token: $scope.credentials.externalToken,
				username: $scope.username,
				location: 'GB'
			}).then(function () {
				$location.redirect('/organise');
			},
			function (data) {
				if (data.form_errors.external_system) {
					$scope.errors = data.form_errors.external_system;
				} else if (data.form_errors.external_token) {
					$scope.errors = data.form_errors.external_token;
				} else if (data.form_errors.username) {
					$scope.errors = data.form_errors.username;
				} else {
					$scope.errors = 'Invalid request';
				}
			});
		};
  }]
);