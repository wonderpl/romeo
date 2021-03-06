angular.module('RomeoApp.login')
.controller('TwitterLoginCtrl', ['$scope', '$location', 'SecurityService', 'AccountService',
    function ($scope, $location, SecurityService, AccountService) {
      'use strict';
      function init() {
        $scope.isLoading = false;
        $scope.profile = $scope.profile || {};
        if (! $scope.profile.display_name && SecurityService.getExternalCredentials()) {
            $scope.profile.display_name = SecurityService.getExternalCredentials().metadata.screen_name;
        }
        if (! $scope.profile.location) {
          AccountService.getGeoIpLocation().then(function (res) {
            $scope.profile.location = res.data;
          });
        }

        $scope.save = function() {
          $scope.errors = '';

          externalLogin($scope.profile);
        };
      }

      function externalLogin(profile) {
        SecurityService.ExternalLogin(profile).then(function (response) {
          SecurityService.restoreUrl('/settings/import');
        },
        function (response) {
          if (response.data.error == 'registration_required') {
            // Do nothing, just show this page
          } else if (response.data.error == 'registration_token_required') {
            alert("Registration is by invite only");
          } else if (response.data.form_errors && response.data.form_errors.username) {
            $scope.errors = response.data.form_errors.username[0];
          } else {
            alert("Something went wrong with your sign in:\n" + response.data);
          }
        });
      }
      init();
  }]
);
