
angular
  .module('RomeoApp.directives')
  .directive('profileCover', ['$templateCache', 'UploadService', 'AccountService', '$timeout', ProfileCoverDirective]);

function ProfileCoverDirective ($templateCache, UploadService, AccountService, $timeout) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile-cover.html'),
    scope : {
      image: '=',
      isEdit : '=',
      isHero : '='
    },
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
        AccountService.updateCoverImage(file).then(function (data) {
          $scope.$emit('uploaded-image', data);
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

