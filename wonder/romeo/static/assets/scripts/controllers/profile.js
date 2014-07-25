angular.module('RomeoApp.controllers')
  .controller('ProfileCtrl', ['$scope', 'AccountService', 'UploadService',
  function($scope, AccountService, UploadService) {

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

  function loadUserDetails () {
    AccountService.getUser().then(function (data) {
      console.log(data);
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
    AccountService.updateAvatar(file).then(function (data) {
      console.log(data);
      $scope.profile = data;
    });
  }

  function uploadProfileCover ($event, file) {
    console.log('uploadProfileCover()');
    console.log(file);
    AccountService.updateCoverImage(file).then(function (data) {
      console.log(data);
      $scope.profile = data;
    });
  }

  function save () {
    AccountService.updateUser({
      display_name  : $scope.profile.display_name,
      description   : $scope.profile.description
    }).then(function () {
      $scope.isEdit = false;
    });
  }

  function cancel () {
    $scope.isEdit = false;
    loadUserDetails();
  }



}]);






