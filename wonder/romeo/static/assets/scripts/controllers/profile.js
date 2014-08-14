angular.module('RomeoApp.controllers')
  .controller('ProfileCtrl', ['$scope', 'AccountService', 'UploadService', '$timeout',
  function($scope, AccountService, UploadService, $timeout) {
  'use strict';
  var debug = new DebugClass('ProfileCtrl');

// {
//  "href": "/api/account/27250600",
//  "name": "romeo account name",
//  "display_name": "dolly user name",
//  "description": "dolly profile description",
//  "profile_cover": "http://path/to/dolly/profile/cover.jpg",
//  "avatar": "http://path/to/dolly/avatar/image.jpg"
// }

  $scope.isEdit = false;
  $scope.uploadingProfileImage = false;
  $scope.uploadingProfileCover = false;
  $scope.errorDescritionToLong = false;

  function loadUserDetails () {
    AccountService.getUser().then(function (data) {
      $scope.profile = data;
    });
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
        $scope.errorDescritionToLong = (newValue.length > 100);
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
    $scope.uploadingProfileImage = true;
    $scope.$emit('notify', {
      status : 'info',
      title : 'Uploading New Avatar',
      message : 'Image uploading.'}
    );
    AccountService.updateAvatar(file).then(function (data) {
      $timeout(function () {
        //$scope.profile = data;
        $scope.$emit('notify', {
          status : 'success',
          title : 'Avatar Updated',
          message : 'New image saved.'}
        );
      $scope.uploadingProfileImage = false;
      doneUploadingImage($events, data);
      });
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
    $scope.uploadingProfileCover = true;
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
      $scope.uploadingProfileCover = false;
      doneUploadingImage(null, data);
    });
  }

  function save () {
    var data = {
      display_name  : $scope.profile.display_name,
      description   : $scope.profile.description
    };
    AccountService.updateUser(data).then(function () {
      $scope.isEdit = false;
      $scope.$emit('notify', {
        status : 'success',
        title : 'Profile Updated',
        message : 'Profile details saved.'}
      );
    });
  }

  function cancel () {
    $scope.isEdit = false;
    loadUserDetails();
  }

}]);






