angular.module('RomeoApp.directives')
  .directive('videoThumbnail', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-thumbnail.html'),
    link : function (scope, elem, attrs) {

      scope.isSelect = false;

      scope.background = attrs.background;

      scope.selectThumbnail = function () {

        scope.isSelect = true;
      };

      scope.previousBackground = function () {

        scope.background = "http://ak.c.ooyala.com/l0dWJnbjpLZ5hwo3aVaBFqpVICC63Wo3/3Gduepif0T1UGY8H4xMDoxOjBhOzV3Va";
      };

      scope.nextBackground = function () {

        scope.background = "http://i.ytimg.com/vi/SyYSBBE1DFw/mqdefault.jpg";
      };

      scope.setBackground = function () {

        //make ajax PATCH call

        //then show video

        scope.hasVideo = true;
      };
    }
  };
}]);