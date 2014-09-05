
(function () {

'use strict';
var debug = new DebugClass('RomeoApp.profile');

function ProfileRouteProvider($routeProvider, securityAuthorizationProvider) {
        // Account management
        $routeProvider.when('/profile', {
            templateUrl: 'profile/profile.tmpl.html',
            controller: 'MainCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Public  profile
        $routeProvider.when('/profile/:id', {
            templateUrl: 'profile/profile.tmpl.html',
            controller: 'MainCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });
}

angular.module('RomeoApp.profile').config(['$routeProvider', 'securityAuthorizationProvider', ProfileRouteProvider]);

function ProfileCtrl($scope, $location, $routeParams, AccountService, UserService, UploadService, VideoService, LocationService, SecurityService, modal) {
  var ProfileController = {};
  var locations;

  function init() {
    $scope.flags = {
      isEdit: false,
      isOwner: false,
      uploadingProfileImage: false,
      uploadingProfileCover: false,
      isFormValid: true,
      accountId: null
    };
    // Some simple defaults in case the web service call hasn't completed
    locations = { 'country': { 'items': [
      { 'code': 'GB', 'name': 'United Kingdom' },
      { 'code': 'US', 'name': 'United States' },
      { 'code': 'FR', 'name': 'France' },
      { 'code': 'DE', 'name': 'Germany' },
      { 'code': 'ES', 'name': 'Spain' }
    ] } };

    $scope.$on('profile-save', ProfileController.save);
    $scope.$on('profile-cancel', ProfileController.cancel);
    $scope.$on('upload-profile-image', ProfileController.uploadProfileImage);
    $scope.$on('uploaded-image', ProfileController.doneUploadingImage);
    $scope.$on('upload-profile-cover', ProfileController.uploadProfileCover);
    $scope.$on('send-invitation-request', ProfileController.sendInvitationRequest);

    $scope.$watch('profile.description', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (typeof newValue !== 'undefined')
          $scope.flags.errorDescritionToLong = (newValue.length > 100);
      }
    });

    $scope.$watch('profile.profile_cover', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        debug.log('Profile cover changed to: ' + newValue);
      }
    });

    $scope.$watch('profile.avatar', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        debug.log('Profile avatar changed to: ' + newValue);
      }
    });

    $scope.$watch(function () {
      return UserService.getUser();
    }, function (newValue, oldValue) {
      if (newValue !== oldValue && $scope.flags.isOwner)
        $scope.profile = newValue;
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

    ProfileController.loadUserDetails();
  }

  function loadPublicProfile(id) {
    UserService.getPublicUser(id).then(function(res) {
      $scope.profile = res.data;
      $scope.flags.accountId = id;
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

  function loadPrivateProfile() {
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

  ProfileController.loadUserDetails = function() {
    if ($routeParams.id) {
      loadPublicProfile($routeParams.id);
    } else {
      loadPrivateProfile();
    }
    LocationService.getAll().then(function (res) {
      locations = res.data;
    });
  };

  ProfileController.uploadProfileImage = function ($event, file) {
    debug.log('uploadProfileImage()');
    debug.log(file);
    $scope.flags.uploadingProfileImage = true;
    $scope.$emit('notify', {
      status : 'info',
      title : 'Uploading New Avatar',
      message : 'Image uploading.'}
    );
    UserService.updateAvatar(file).then(function (data) {
      $scope.$emit('notify', {
        status : 'success',
        title : 'Avatar Updated',
        message : 'New image saved.'}
      );
      $scope.flags.uploadingProfileImage = false;
      ProfileController.doneUploadingImage($events, data);
    });
  };

  ProfileController.doneUploadingImage = function ($event, data) {
    //Only update the profile cover and avatar, leaving the rest of the profile in it's current state
    var profile = angular.fromJson(data);
    debug.log('doneUploadingImage');
    debug.dir(profile);
    $scope.profile.profile_cover = profile.profile_cover;
    $scope.profile.avatar = profile.avatar;
  };

  ProfileController.uploadProfileCover = function ($event, file) {
    debug.log('uploadProfileCover()');
    debug.log(file);
    $scope.flags.uploadingProfileCover = true;
    $scope.$emit('notify', {
      status : 'info',
      title : 'Uploading New Cover Photo',
      message : 'Image uploading.'}
    );
    UserService.updateCoverImage(file).then(function (data) {
      $scope.$emit('notify', {
        status : 'success',
        title : 'Cover Image Updated',
        message : 'New cover image saved.'}
      );
      $scope.flags.uploadingProfileCover = false;
      ProfileController.doneUploadingImage(null, data);
    });
  };

  ProfileController.save = function () {
    if (! $scope.flags.isOwner) {
      $scope.$emit('notify', {
        status : 'error',
        title : 'Access denied',
        message : "Can't save changes to profile of other users"}
      );
    }
    var data = {
      display_name    : $scope.profile.display_name,
      description     : $scope.profile.description,
      title           : $scope.profile.title,
      location        : $scope.profile.location,
      search_keywords : $scope.profile.search_keywords,
      contactable     : $scope.profile.contactable
    };
    UserService.updateUser(data).then(function () {
      $scope.flags.isEdit = false;
      $scope.$emit('notify', {
        status : 'success',
        title : 'Profile Updated',
        message : 'Profile details saved.'}
      );
    });
  };

  ProfileController.cancel = function () {
    $scope.flags.isEdit = false;
    ProfileController.loadUserDetails();
  };

  ProfileController.sendInvitationRequest = function ($event, invite) {
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
  return ProfileController;
}

angular.module('RomeoApp.profile').controller('ProfileCtrl', ['$scope', '$location', '$routeParams', 'AccountService', 'UserService', 'UploadService', 'VideoService', 'LocationService', 'SecurityService', 'modal', ProfileCtrl]);

})();





