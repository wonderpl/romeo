angular.module('RomeoApp.directives')
  .directive('organiseVideo', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-video.html'),
    scope : {},
    controller : function ($scope) {

    }
  };
}]);