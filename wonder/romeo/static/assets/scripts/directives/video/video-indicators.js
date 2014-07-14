angular.module('RomeoApp.directives')
  .directive('videoIndicators', ['$rootScope', '$templateCache', 'CommentsService', '$timeout',
  function ($rootScope, $templateCache, CommentsService, $timeout) {

  'use strict';

  return {
    restrict : 'AE',
    replace: true,
    template : $templateCache.get('video-indicators.html'),
    link : function(scope, elem, attrs) {

      scope.$watch('videoTotalTime', function (time) {

        var length = time/1000;

        var comments = scope.comments || [];

        var i = comments.length;

        while (i--) {

          comments[i].position = ((Math.round((comments[i].mark/length)*10000))/100) + '%';
        }

      }, true);

      scope.commentHover = function (time) {

        var comments = scope.comments;

        var i = comments.length;

        while (i--) {

          comments[i].isHover = comments[i].mark === time;
        }
      };


      scope.seek = function (time) {

        if (scope.player) {

          scope.player.setPlayheadTime(time);
        }

        $timeout(function () {

          var $el = angular.element(document.querySelectorAll('.video-feedback__comment[data-mark="' + time + '"]')[0]);

          var top = $el.position().top;

          document.querySelectorAll('.video-feedback__comments')[0].scrollIntoView();

          angular.element(document.querySelectorAll('.video-feedback__comments')[0]).scrollTop(top);

        }, 0);

      };

      scope.pauseVideo = function (e) {

        if (scope.player) {

          scope.player.pause();
        }
      };

      scope.playVideo = function (e) {

        if (scope.player) {

          scope.player.play();
        }
      };
    }
  };
}]);