angular.module('RomeoApp.directives')
  .directive('organiseNavigation', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-navigation.html'),
    scope : {
      tags : '='
    },
    controller : function ($scope) {

      $scope.loadCollection = function (id) {

        $scope.$emit('show-collection', id);
      };
    }
  };
}]);