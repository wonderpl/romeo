
(function () {

'use strict';
var debug = new DebugClass('RomeoApp.profile');

function ProfileRouteProvider($routeProvider, securityAuthorizationProvider) {
        // Account management
        $routeProvider.when('/profile', {
            templateUrl: 'profile/profile.tmpl.html',
            controller: 'ProfileCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Edit  profile
        $routeProvider.when('/profile/edit', {
            templateUrl: 'profile/profile.tmpl.html',
            controller: 'ProfileEditCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Public  profile
        $routeProvider.when('/profile/:id', {
            templateUrl: 'profile/profile.tmpl.html',
            controller: 'ProfilePublicCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });
}

angular.module('RomeoApp.profile').config(['$routeProvider', 'securityAuthorizationProvider', ProfileRouteProvider]);

function ProfileCtrl($scope, $location, $routeParams, AccountService, UserService, UploadService, VideoService, LocationService, SecurityService, modal) {
  var ctrl = {};
  var locations;

  function init() {
    $scope.flags = {
      isEdit: false,
      isOwner: true,
      uploadingProfileImage: false,
      uploadingProfileCover: false,
      isFormValid: true,
      accountId: null
    };

    // Defaults until the web service call is completed
    locations = { 'country': { 'items': [
      { 'code': 'GB', 'name': 'United Kingdom' },
      { 'code': 'US', 'name': 'United States' },
      { 'code': 'FR', 'name': 'France' },
      { 'code': 'DE', 'name': 'Germany' },
      { 'code': 'ES', 'name': 'Spain' }
    ] } };
    LocationService.getAll().then(function (res) {
      locations = res.data;
    });

    $scope.findLocationName = function () {
      var name = '';
      if ($scope.profile.location) {
        angular.forEach(locations.country.items, function (value) {
          if (value.code === $scope.profile.location) {
            name = value.name;
            return;
          }
        });
      }
      return name;
    };

    $scope.flags.isOwner = true;
    $scope.profile = UserService.getUser();
    if ($scope.profile) {
      $scope.flags.accountId = $scope.profile.id;
    }
    if (SecurityService.isAuthenticated()) {
      UserService.getPublicConnections($scope.profile.id).then(function (res) {
        $scope.connections = res.data.connection.items;
      });
    }
    // We should use the following code, to pull in all collaborators on
    // the private profile page, not just the public collaborators.
    //
    // UserService.getConnections().then(function (res) {
    //   $scope.connections = [];
    //   angular.forEach(res, function (value, key) {
    //     $scope.connections.push(value.collaborator ? value.collaborator : value.user);
    //   });
    //   console.log('Private profile connections: ', $scope.connections);
    // });
  }


  init();
  return ctrl;
}

angular.module('RomeoApp.profile').controller('ProfileCtrl', ['$scope', '$location', '$routeParams', 'AccountService', 'UserService', 'UploadService', 'VideoService', 'LocationService', 'SecurityService', 'modal', ProfileCtrl]);

})();





