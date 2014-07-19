angular.module('RomeoApp.directives')
  .directive('pageHeader', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('page-header.html')
  };
}]);