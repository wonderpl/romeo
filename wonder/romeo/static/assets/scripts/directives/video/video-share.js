angular.module('RomeoApp.directives')
  .directive('videoShare', ['$templateCache', '$sce', function ($templateCache, $sce) {

  'use strict';

  return {
    restrict : 'AE',
    replace : true,
    template : $templateCache.get('video-share.html'),
    link : function (scope, elem, attrs) {

    }
  };
}]);