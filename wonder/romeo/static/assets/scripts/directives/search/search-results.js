
angular.module('RomeoApp.directives')
  .directive('searchResults', ['$templateCache', function ($templateCache) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('search-results.html'),
    scope : {
      expression : '=',
      results : '='
    },
    controller : function ($scope) {

    }
  };
}]);


