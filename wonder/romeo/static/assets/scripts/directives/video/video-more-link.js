angular.module('RomeoApp.directives')
  .directive('videoMoreLink', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-more-link.html'),
    scope : {
      text : '=',
      url : '='
    }
  };
}]);