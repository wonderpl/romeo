angular.module('RomeoApp.directives')
  .directive('videoColorPicker', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-color-picker.html'),
    link : function (scope, elem, attrs) {

    }
  };
}]);