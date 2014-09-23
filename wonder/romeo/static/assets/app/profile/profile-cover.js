
angular
  .module('RomeoApp.profile')
  .directive('profileCover', ['$templateCache', 'UserService',
function ($templateCache, UserService) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile/profile-cover.dir.html'),
    scope : true,
    controller : function ($scope) {
      $scope.uploadProfileCover = function (files) {
        $scope.loading = true;
        var file = files[0];

        console.log('uploadProfileCover()');
        console.log(file);
        $scope.$emit('notify', {
          status : 'info',
          title : 'Uploading New Cover Photo',
          message : 'Image uploading.'}
        );
        UserService.updateCoverImage(file).then(function (data) {
          var profile = angular.fromJson(data);
          $scope.profile.profile_cover = profile.profile_cover;
          $scope.profile.avatar = profile.avatar;

          $scope.$emit('notify', {
            status : 'success',
            title : 'Cover Image Updated',
            message : 'New cover image saved.'}
          );
          $scope.loading = false;
        });

      };

    }
  };
}
]);
