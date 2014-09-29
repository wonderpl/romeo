(function () {

'use strict';
var debug = new DebugClass('RomeoApp.profile.edit');


function ProfileEditCtrl($scope, $location, UserService) {
  var ctrl = {};

  function init() {
    $scope.flags = {
      isEdit: true,
      isOwner: true,
      uploadingProfileImage: false,
      uploadingProfileCover: false,
      isFormValid: true,
      userId: null
    };

    $scope.$on('profile-save', ctrl.save);
    $scope.$on('upload-profile-image', ctrl.uploadAvatar);
    $scope.$on('upload-profile-cover', ctrl.uploadProfileCover);

    loadPrivateProfile();
  }

  // @TODO: We should move this into a service or something
  function htmlToPlaintext(text) {
    if (text)
      return String(text).replace(/<[^>]+>/gm, '');
    return '';
  }

  function loadPrivateProfile() {
      $scope.profile = angular.copy(UserService.getUser());
      if ($scope.profile) {
        $scope.flags.userId = $scope.profile.id;
      }
  }


  ctrl.uploadAvatar = function ($event, file) {
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
      ctrl.doneUploadingImage($events, data);
    });
  };

  ctrl.uploadProfileCover = function ($event, file) {
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
      ctrl.doneUploadingImage(null, data);
    });
  };

  ctrl.save = function () {
    if (! $scope.flags.isOwner) {
      $scope.$emit('notify', {
        status : 'error',
        title : 'Access denied',
        message : "Can't save changes to profile of other users"}
      );
    }
    if ($scope.profile.website_url) {
      if (! $scope.profile.website_url.match(/^http[s]?:\/\/.+/i)) {
        if ($scope.profile.website_url.match(/^http[s]?:\/\/$/i)) {
          $scope.profile.website_url = '';
        }
        else {
          $scope.profile.website_url = 'http://' + $scope.profile.website_url;
        }
      }
    }
    var data = {
      display_name    : htmlToPlaintext($scope.profile.display_name),
      description     : htmlToPlaintext($scope.profile.description),
      title           : htmlToPlaintext($scope.profile.title),
      location        : htmlToPlaintext($scope.profile.location),
      search_keywords : htmlToPlaintext($scope.profile.search_keywords),
      website_url     : htmlToPlaintext($scope.profile.website_url),
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
    $location.url('/profile');
  };

  init();
  return ctrl;
}

angular.module('RomeoApp.profile').controller('ProfileEditCtrl', ['$scope', '$location', 'UserService', ProfileEditCtrl]);

})();