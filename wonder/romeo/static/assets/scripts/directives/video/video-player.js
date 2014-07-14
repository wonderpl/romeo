angular.module('RomeoApp.directives')
  .directive('videoPlayer', ['$templateCache', '$sce', function ($templateCache, $sce) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-player.html'),
    scope : {
      'embedUrl' : '='
    }
  };
}]);