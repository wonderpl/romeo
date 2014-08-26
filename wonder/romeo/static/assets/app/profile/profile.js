
(function () {

'use strict';
var debug = new DebugClass('RomeoApp.profile');

angular.module('RomeoApp.profile', ['RomeoApp.profile.directives', 'RomeoApp.services', 'RomeoApp.security', 'ngRoute']);
// Define other profile sub modules
angular.module('RomeoApp.profile.directives', []);
// End other sub modules

function ProfileRouteProvider($routeProvider, securityAuthorizationProvider) {
        // Account management
        $routeProvider.when('/profile', {
            templateUrl: 'profile/profile.tmpl.html',
        //    resolve: securityAuthorizationProvider.requireCollaborator
        });

        // Public  profile
        $routeProvider.when('/profile/:id', {
            templateUrl: 'profile/profile.tmpl.html',
        //    resolve: securityAuthorizationProvider.requireCollaborator
        });
}

angular.module('RomeoApp.profile').config(['$routeProvider', 'securityAuthorizationProvider', ProfileRouteProvider]);

function ProfileCtrl($scope, AccountService, AuthService, DataService, $location, UploadService, $routeParams, modal) {
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

    $scope.sendInvite = function () {
      console.log($scope.invitation);
      modal.hide();
    };

    $scope.invite = function () {
      modal.load('invite-collaboration.html', true, $scope);
      $scope.invitation = {};
    };

    $scope.close = function () {
      modal.hide();
    };

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

    ProfileController.loadUserDetails();
  }

  ProfileController.loadUserDetails = function() {
    if ($routeParams.id) {
      DataService.request({url: ('/api/account/' + $routeParams.id)}).then(function(response){
          $scope.profile = response;
          $scope.flags.accountId = $routeParams.id;

        $scope.profile.location = 'London, UK';
        $scope.profile.website = 'http://www.mini.me';

        $scope.profile.jobTitle = 'Mastermind';
      }, function (response) {
        console.dir(response);
        $scope.$emit('notify', {
          status : 'error',
          title : 'User not found',
          message : 'Could not find the user you were looking for'}
        );
        $location.path('/organise', true);
      });
    } else {
      $scope.flags.isOwner = true;
      AccountService.getUser().then(function (user) {
        $scope.profile = user;
        AuthService.getSessionId().then(function (id) {
          $scope.flags.accountId = id;
        });
      });
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
    AccountService.updateAvatar(file).then(function (data) {
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
    AccountService.updateCoverImage(file).then(function (data) {
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
      website         : $scope.profile.website,
      location        : $scope.profile.location,
      search_keywords : $scope.profile.search_keywords
    };
    AccountService.updateUser(data).then(function () {
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

  init();
  return ProfileController;
}

angular.module('RomeoApp.profile').controller('ProfileCtrl', ['$scope', 'AccountService', 'AuthService', 'DataService', '$location', 'UploadService', '$routeParams', 'modal', ProfileCtrl]);

})();





