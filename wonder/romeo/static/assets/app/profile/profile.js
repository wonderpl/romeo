angular.module('RomeoApp.profile', ['RomeoApp.services', 'RomeoApp.security', 'RomeoApp.profile.navigation', 'ngRoute'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
        'use strict';
        // Account management
        $routeProvider.when('/profile', {
            templateUrl: 'profile/profile.tmpl.html',
        //    resolve: securityAuthorizationProvider.requireCollaborator
        });
        
        // Public  profile
        $routeProvider.when('/profile/:id', {
            templateUrl: 'profile/profile.html',
        //    resolve: securityAuthorizationProvider.requireCollaborator
        });
}])

.controller('ProfileCtrl', ['$scope', 'AccountService', 'DataService', '$location', 'UploadService', '$routeParams',
  function($scope, AccountService, DataService, $location, UploadService, $routeParams) {
  'use strict';
  var debug = new DebugClass('ProfileCtrl');

  $scope.flags = {
    isEdit: false,
    isOwner: false,
    uploadingProfileImage: false,
    uploadingProfileCover: false,
    errorDescritionToLong: false
  };

  function loadUserDetails () {
    if ($routeParams.id) {
      DataService.request({url: ('/api/account/' + $routeParams.id)}).then(function(response){
          $scope.profile = response;
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
      });
    }
  }

  loadUserDetails();

  $scope.$on('profile-save', save);

  $scope.$on('profile-cancel', cancel);

  $scope.$on('upload-profile-image', uploadProfileImage);

  $scope.$on('uploaded-image', doneUploadingImage);

  $scope.$on('upload-profile-cover', uploadProfileCover);

  $scope.$watch('profile.description', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      if (typeof newValue !== 'undefined')
        $scope.flags.errorDescritionToLong = (newValue.length > 100);
    }
  });

  $scope.$watch('profile.profile_cover', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      debug.log('Profile cover changed to: ' + newValue);
    }
  });

  $scope.$watch('profile.avatar', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      debug.log('Profile avatar changed to: ' + newValue);
    }
  });

  function uploadProfileImage ($event, file) {
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
      doneUploadingImage($events, data);
    });
  }
  function doneUploadingImage($event, data) {
    //Only update the profile cover and avatar, leaving the rest of the profile in it's current state
    var profile = angular.fromJson(data);
    debug.log('doneUploadingImage');
    debug.dir(profile);
    $scope.profile.profile_cover = profile.profile_cover;
    $scope.profile.avatar = profile.avatar;
  }

  function uploadProfileCover ($event, file) {
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
      doneUploadingImage(null, data);
    });
  }

  function save () {
    if (! $scope.flags.isOwner) {
      $scope.$emit('notify', {
        status : 'error',
        title : 'Access denied',
        message : "Can't save changes to profile of other users"}
      );
    }
    var data = {
      display_name  : $scope.profile.display_name,
      description   : $scope.profile.description
    };
    AccountService.updateUser(data).then(function () {
      $scope.flags.isEdit = false;
      $scope.$emit('notify', {
        status : 'success',
        title : 'Profile Updated',
        message : 'Profile details saved.'}
      );
    });
  }

  function cancel () {
    $scope.flags.isEdit = false;
    loadUserDetails();
  }

}]);






