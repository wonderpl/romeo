angular.module('RomeoApp.directives')
  .directive('collectionAddVideo', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('collection-add-video.html'),
    link : function (scope, elem, attrs) {

    }
  };
}]);