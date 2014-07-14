angular.module('RomeoApp.directives')
  .directive('videoExtendedControls', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-extended-controls.html'),
    link : function (scope, elem, attrs) {

    }
  };
}]);