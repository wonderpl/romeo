angular.module('RomeoApp.controllers')
  .controller('ProfileCtrl', ['$scope', 'AccountService', 'UploadService', '$timeout',
  function($scope, AccountService, UploadService, $timeout) {

  'use strict';

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

  function loadUserDetails () {
    AccountService.getUser().then(function (data) {
      $scope.profile = data;
    });
  }

  loadUserDetails();

  $scope.$on('profile-save', save);

  $scope.$on('profile-cancel', cancel);

  $scope.$on('upload-profile-image', uploadProfileImage);

  $scope.$on('upload-profile-cover', uploadProfileCover);

  function uploadProfileImage ($event, file) {
    console.log('uploadProfileImage()');
    console.log(file);
    $scope.uploadingProfileImage = true;
    $scope.$emit('notify', {
      status : 'info',
      title : 'Uploading New Avatar',
      message : 'Image uploading to server. Your page will update when transfer is complete.'}
    );
    AccountService.updateAvatar(file).then(function (data) {
      console.log(data);
      $timeout(function () {
        $scope.profile = data;
        $scope.$emit('notify', {
          status : 'success',
          title : 'Avatar updated',
          message : 'New avatar saved.'}
        );
      $scope.uploadingProfileImage = false;
      loadUserDetails();
      });
    });
  }

  function uploadProfileCover ($event, file) {
    console.log('uploadProfileCover()');
    console.log(file);
    $scope.uploadingProfileCover = true;
    $scope.$emit('notify', {
      status : 'info',
      title : 'Uploading New Cover Image',
      message : 'Image uploading to server. Your page will update when transfer is complete.'}
    );
    AccountService.updateCoverImage(file).then(function (data) {
      $scope.profile = JSON.parse(data);
      $scope.$emit('notify', {
        status : 'success',
        title : 'Cover image updated',
        message : 'New cover image saved.'}
      );
      $scope.uploadingProfileCover = false;
      loadUserDetails();
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
        title : 'User Profile Updated',
        message : 'Profile details saved.'}
      );
    });
  }

  function cancel () {
    $scope.isEdit = false;
    loadUserDetails();
  }

}]);






