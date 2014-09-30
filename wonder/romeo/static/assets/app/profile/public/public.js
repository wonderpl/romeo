(function () {

'use strict';
var debug = new DebugClass('RomeoApp.profile.public');


function ProfilePublicCtrl($scope, $location, $routeParams, UserService, VideoService, LocationService, SecurityService) {
  var locations,
      ctrl = {};

  function init() {
    $scope.flags = {
      isEdit: false,
      isOwner: false,
      uploadingProfileImage: false,
      uploadingProfileCover: false,
      isFormValid: true,
      userId: null
    };
    // Some simple defaults in case the web service call hasn't completed
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

    $scope.$on('send-invitation-request', ctrl.sendInvitationRequest);
    loadUserDetails();
  }



  function loadUserDetails() {
    var id = $routeParams.id;
    UserService.getPublicUser(id).then(function(res) {
      $scope.profile = res.data;
      $scope.flags.userId = id;
      UserService.getPublicConnections(id).then(function (res) {
        $scope.connections = res.data.connection.items;
      });
      VideoService.getPublicVideos(id).then(function (res) {
        $scope.videos = res.data.video.items;
      });
      VideoService.getPublicCollaborationVideos(id).then(function (res) {
        $scope.collaborationVideos = res.data.video.items;
      });
    }, function (res) {
      $scope.$emit('notify', {
        status : 'error',
        title : 'User not found',
        message : 'Could not find the user you were looking for'}
      );
      $location.path('/organise', true);
    });
  }

  ctrl.sendInvitationRequest = function ($event, invite) {
    console.warn(invite);
    UserService.connect(invite)
    .then(function () {
      $scope.$emit('notify', {
        status : 'success',
        title : 'Connect invitation sent',
        message : 'Invitation to connect has been sent to ' + $scope.profile.display_name + '.'}
      );
    }, function () {
      $scope.$emit('notify', {
        status : 'error',
        title : 'Invitation not sent',
        message : 'Invitation to connect was not sent.'}
      );
    });
  };

  init();
  return ctrl;
}

angular.module('RomeoApp.profile').controller('ProfilePublicCtrl', ['$scope', '$location', '$routeParams', 'UserService', 'VideoService', 'LocationService', 'SecurityService', ProfilePublicCtrl]);

})();