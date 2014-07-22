angular.module('RomeoApp.directives')
  .directive('organiseVideo', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-video.html'),
    scope : {
      video : '='
    },
    controller : function ($scope) {

      $scope.delete = function (video) {
        $scope.$emit('delete-video', video);
      };

      $scope.addRemove = function (video) {
        $scope.$emit('add-remove-video', video);
      };
    }
  };
}]);