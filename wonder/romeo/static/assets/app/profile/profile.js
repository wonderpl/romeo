
(function () {

'use strict';
var debug = new DebugClass('RomeoApp.profile');

function ProfileRouteProvider($routeProvider, securityAuthorizationProvider) {
        // Account management
        $routeProvider.when('/profile', {
            templateUrl: 'profile/profile.tmpl.html',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Public  profile
        $routeProvider.when('/profile/:id', {
            templateUrl: 'profile/profile.tmpl.html',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });
}

angular.module('RomeoApp.profile').config(['$routeProvider', 'securityAuthorizationProvider', ProfileRouteProvider]);

function ProfileCtrl($scope, $location, $routeParams, AccountService, UserService, UploadService, modal) {
  var ProfileController = {};

  function init() {
    $scope.flags = {
      isEdit: false,
      isOwner: false,
      uploadingProfileImage: false,
      uploadingProfileCover: false,
      isFormValid: true,
      accountId: null
    };

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

    ProfileController.loadUserDetails();
  }

  ProfileController.loadUserDetails = function() {
    if ($routeParams.id) {
      UserService.getPublicUser($routeParams.id).then(function(res) {
        $scope.profile = res.data;
        $scope.flags.accountId = $routeParams.id;
        UserService.getPublicConnections($routeParams.id).then(function (res) {
          $scope.connections = res.data;
        });
      }, function (res) {
        $scope.$emit('notify', {
          status : 'error',
          title : 'User not found',
          message : 'Could not find the user you were looking for'}
        );
        $location.path('/organise', true);
      });
    } else {
      $scope.flags.isOwner = true;
      $scope.profile = UserService.getUser();
      if ($scope.profile) {
        $scope.flags.accountId = $scope.profile.id;
      }
    }
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
      website_url     : $scope.profile.website_url,
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

  ProfileController.sendInvitationRequest = function (invite) {
    UserService.connect(invite.id)
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

angular.module('RomeoApp.profile').controller('ProfileCtrl', ['$scope', '$location', '$routeParams', 'AccountService', 'UserService', 'UploadService', 'modal', ProfileCtrl]);

})();





