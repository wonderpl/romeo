
angular
  .module('RomeoApp.profile')
  .directive('profileImage', ['$templateCache', 'AccountService', '$timeout',
    function ($templateCache, AccountService, $timeout) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile/images/image.tmpl.html'),
    scope: {
      profile : '=',
      isEdit : '='
    },
    controller : function ($scope) {
      function init() {
        $scope.loading = false;
        if ($scope.profile)
          setAvater($scope.profile.avatar);
      }
      function setAvater(avatar) {
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
        AccountService.updateAvatar(file).then(function (data) {
          console.log(data);
          $scope.$emit('uploaded-image', data);

          $scope.profile = data;
          $scope.$emit('notify', {
            status : 'success',
            title : 'Avatar Updated',
            message : 'New image saved.'}
          );
          $scope.loading = false;
        });
      };
      $scope.$watch('profile', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          setAvater(newValue);
        }
      }, true);
      init();
    }
  };
}]);
