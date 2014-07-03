angular.module('RomeoApp.directives')
  .directive('videoEdit', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-edit.html'),
    link : function (scope, elem, attrs) {

      scope.updatePreview = function () {

      };
    }
  };
}]);