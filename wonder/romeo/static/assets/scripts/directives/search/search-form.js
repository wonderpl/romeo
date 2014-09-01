
angular.module('RomeoApp.directives')
  .directive('searchForm', ['$templateCache', function ($templateCache) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('search-form.html'),
    scope : {
      q : '=',
      location : '='
    }
  };
}]);


