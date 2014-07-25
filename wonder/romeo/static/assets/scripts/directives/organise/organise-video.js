angular
  .module('RomeoApp.directives')
  .directive('organiseVideo', ['$templateCache', OrganiseVideo]);

function OrganiseVideo ($templateCache) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-video.html'),
    scope : {
      video : '=',
      isList : '='
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
}