
angular.module('RomeoApp.directives')
  .directive('searchResults', ['$templateCache', '$location', function ($templateCache, $location) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('search-results.html'),
    scope : {
      expression : '=',
      results : '=',
      query : '='
    }
  };
}]);


