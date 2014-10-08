
angular
  .module('RomeoApp.organise')
  .directive('organiseCollection', ['$templateCache', OrganiseCollectionDirective]);

function OrganiseCollectionDirective ($templateCache) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise/organise-collection.tmpl.html'),
    scope : {
      tag : '=',
      isEdit : '='
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
}
