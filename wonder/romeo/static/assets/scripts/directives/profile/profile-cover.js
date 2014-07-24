angular.module('RomeoApp.directives')
  .directive('profileCover', ['$templateCache', 'UploadService',
  function ($templateCache, UploadService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile-cover.html'),
    scope : {
      image: '=',
      isEdit : '='
    },
    controller : function ($scope) {

      $scope.onFileSelect = function(files) {

        console.log(files);

        // UploadService.uploadVideo(files[0]);
      };

      $scope.uploadProfileCover = function (files) {

        $scope.$emit('upload-profile-cover', files[0]);
      };
    }
  };
}]);