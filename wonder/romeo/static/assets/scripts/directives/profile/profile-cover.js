
angular
  .module('RomeoApp.directives')
  .directive('profileCover', ['$templateCache', 'UploadService', ProfileCoverDirective]);

function ProfileCoverDirective ($templateCache, UploadService) {
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
      $scope.uploadProfileCover = function (files) {
        $scope.$emit('upload-profile-cover', files[0]);
      };
    }
  };
}

