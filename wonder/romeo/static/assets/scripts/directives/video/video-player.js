angular.module('RomeoApp.directives')
  .directive('videoPlayer', ['$templateCache', '$sce', function ($templateCache, $sce) {

  'use strict';

  return {
    restrict : 'AE',
    replace : true,
    template : $templateCache.get('video-player.html'),
    link : function (scope, elem, attrs) {

      scope.url = $sce.trustAsResourceUrl(elem.attr('url'));
    }
  };
}]);