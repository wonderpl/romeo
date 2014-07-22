angular.module('RomeoApp.directives')
  .directive('organiseCollection', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-collection.html'),
    scope : {
      tag : '='
    },
    controller : function ($scope) {

      $scope.isEdit = false;

      $scope.save = function () {
        $scope.$emit('save-tag');
        $scope.isEdit = false;
      };

      $scope.delete = function () {
        $scope.$emit('delete-tag');
        $scope.isEdit = false;
      };
    }
  };
}]);