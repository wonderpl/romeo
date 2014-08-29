
angular.module('RomeoApp.directives')
  .directive('searchForm', ['$templateCache', function ($templateCache) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('search-form.html'),
    scope : {
      expression : '=',
      country : '='
    },
    controller : function ($scope) {
      $scope.search = function ($event) {
        $scope.$emit('search', $scope.expression);
      };
    }
  };
}]);


