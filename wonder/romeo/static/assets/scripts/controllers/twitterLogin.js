angular
  .module('RomeoApp.controllers')
  .controller('TwitterLoginCtrl', ['$scope', 'AuthService', 'AccountService',
  	function ($scope, AuthService, AccountService) {
  		'use strict';

  		$scope.isLoading = false;

		function loginOrSignup() {
			AccountService.getAccountByExternalToken('twitter', $scope.credentials.externalToken).then(function (data) {
				if (data.username) {
					externalLogin(data.username);
				}
				// User have not registered, do it now
			},
			function () {
				// User not found, register
			});
		}

		$scope.save = function() {
			$scope.errors = '';
			externalLogin($scope.username);
		};

		function externalLogin(username) {
			AuthService.ExternalLogin({
				external_system: "twitter",
				external_token: $scope.credentials.externalToken,
				username: username,
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
		}
  }]
);