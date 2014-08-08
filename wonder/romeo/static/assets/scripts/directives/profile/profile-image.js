
angular
  .module('RomeoApp.directives')
  .directive('profileImage', ['$templateCache', ProfileImageDirective]);

function ProfileImageDirective ($templateCache) {
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
      $scope.uploadProfileImage = function (files) {
        $scope.$emit('upload-profile-image', files[0]);
      };

      $scope.$watch('image', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          var blankProfileImage = '/static/assets/img/user-avatar.png';
          var image;
          if (newValue) {
            image = newValue;
          } else {
            image = blankProfileImage;
          }

          $scope.profileImageStyle = { 'background-image' : 'url(' + image + ')' };
        }
      });

    }
  };
}
