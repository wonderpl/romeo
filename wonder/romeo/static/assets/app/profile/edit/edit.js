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
      accountId: null
    };

    $scope.$on('profile-save', ctrl.save);
    $scope.$on('upload-profile-image', ctrl.uploadAvatar);
    $scope.$on('upload-profile-cover', ctrl.uploadProfileCover);

    $scope.$watch('profile.description', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (typeof newValue !== 'undefined')
          $scope.flags.errorDescritionToLong = (newValue.length > 100);
      }
    });

    loadPrivateProfile();
  }

  function loadPrivateProfile() {
      $scope.profile = angular.copy(UserService.getUser());
      if ($scope.profile) {
        $scope.flags.accountId = $scope.profile.id;
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
    $location.url('/profile');
  };

  init();
  return ctrl;
}

angular.module('RomeoApp.profile').controller('ProfileEditCtrl', ['$scope', '$location', 'UserService', ProfileEditCtrl]);

})();