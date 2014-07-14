angular.module('RomeoApp.directives')
  .directive('videoNavigation', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-navigation.html'),
    link : function (scope, elem, attrs) {

    }
  };
}]);