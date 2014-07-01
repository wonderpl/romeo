angular.module('RomeoApp.directives')
  .directive('categoryAddVideo', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('category-add-video.html'),
    link : function (scope, elem, attrs) {

    }
  };
}]);