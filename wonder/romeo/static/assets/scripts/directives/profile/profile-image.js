angular.module('RomeoApp.directives')
  .directive('profileImage', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile-image.html'),
    scope: {
      image : '=',
      isEdit : '='
    },
    controller : function ($scope) {

      $scope.uploadProfileImage = function () {

        $scope.$emit('upload-profile-image');
      };
    }
  };
}]);