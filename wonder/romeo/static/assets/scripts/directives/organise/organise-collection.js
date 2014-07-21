angular.module('RomeoApp.directives')
  .directive('organiseCollection', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-collection.html'),
    scope : {},
    controller : function ($scope) {

    }
  };
}]);