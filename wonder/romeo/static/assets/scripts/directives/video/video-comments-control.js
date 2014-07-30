angular
  .module('RomeoApp.directives')
  .directive('videoCommentsControl', VideoCommentsControl);


function VideoCommentsControl ($templateCache, $rootScope) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-comments-control.html'),
    scope : {

    },
    controller : function ($scope) {

      $scope.$on('$locationChangeStart', function(event) {
        $rootScope.commentsPosition = 'bottom';
      });

      $scope.reposition = function (position) {
        var commentsPosition;
        switch (position) {
          case 'bottom':
            commentsPosition = 'bottom';
          break;
          case 'wide':
            commentsPosition = 'wide';
          break;
          case 'mirror':
            commentsPosition = 'mirror';
          break;
          default:
            commentsPosition = 'bottom';
          break;
        }
        $rootScope.commentsPosition = position;
      };
    }
  };
}