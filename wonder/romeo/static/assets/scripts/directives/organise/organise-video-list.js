angular.module('RomeoApp.directives')
  .directive('organiseVideoList', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-video-list.html'),
    scope : {
      videos : '='
    },
    controller : function ($scope) {

    }
  };
}]);