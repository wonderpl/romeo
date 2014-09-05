
angular
  .module('RomeoApp.profile')
  .directive('profileImage', ['$templateCache', 'UserService',
    function ($templateCache, UserService) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile/profile-avatar.tmpl.html'),
    scope: true,
    controller : function ($scope) {
      function init() {
        $scope.loading = false;
        if ($scope.profile)
          setAvatar($scope.profile.avatar);
      }
      function setAvatar(avatar) {
        $scope.profileImageStyle = { 'background-image' : 'url(' + (avatar || '/static/assets/img/user-avatar.png') + ')' };
      }
      $scope.uploadProfileImage = function (files) {
        $scope.loading = true;
        var file = files[0];
        console.log('uploadProfileImage()');
        console.log(file);
        $scope.uploadingProfileImage = true;
        $scope.$emit('notify', {
          status : 'info',
          title : 'Uploading New Avatar',
          message : 'Image uploading.'}
        );
        UserService.updateAvatar(file).then(function (data) {
          var profile = angular.fromJson(data);
          $scope.profile.profile_cover = profile.profile_cover;
          $scope.profile.avatar = profile.avatar;

          $scope.$emit('notify', {
            status : 'success',
            title : 'Avatar Updated',
            message : 'New image saved.'}
          );
          $scope.loading = false;
        });
      };
      $scope.$watch('profile.avatar', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          setAvatar(newValue);
        }
      });
      init();
    }
  };
}]);
