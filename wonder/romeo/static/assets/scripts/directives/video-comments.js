angular.module('RomeoApp.directives')
  .directive('videoComments', ['$rootScope', '$templateCache', 'CommentsService',
  function ($rootScope, $templateCache, CommentsService) {

  'use strict';

  function prettifyVideoTime (seconds) {
    var formatted = seconds.toString();
    // 12:04:36
    return formatted;
  }

  function prettifyTimestamp (timestamp) {
    var prettyTimestamp = timestamp;
    // A few days ago
    return prettyTimestamp;
  }

  function getTimeStamp () {
    return Math.round(new Date().getTime() / 1000);
  }

  return {
    restict : 'AE',
    replace: true,
    template : $templateCache.get('video-comments.html'),
    link : function(scope, elem, attrs) {

      scope.comments = [];

      CommentsService.getComments().then(function (data) {
        scope.comments = data.comments;
      });

      scope.addComment = function () {
        var input = angular.element(elem[0].querySelector('.js-feeback-input'));
        var timestamp = getTimeStamp();
        var videoTime = 120; // get current time from video
        var comment = {
          'videoId'         : $rootScope.currentVideoId, // get current video
          'author'          : $rootScope.userName, // get current user
          'text'            : input.val(),
          'timestamp'       : timestamp,
          'videoTime'       : videoTime
          // 'prettyTimestamp' : prettifyTimestamp(timestamp),
          // 'prettyVideoTime' : prettifyVideoTime(videoTime)
        };

        CommentsService.addComment(comment).then(function (data) {
          scope.comments.push(data.comment);
        });
      };

      scope.showReply = function (id) {
        var form = angular.element(elem[0].querySelector('.js-reply-form-' + id));
        form.addClass('video-feedback__reply-form--active');
      };

      scope.hideReply = function (id) {
        var form = angular.element(elem[0].querySelector('.js-reply-form-' + id));
        form.removeClass('video-feedback__reply-form--active');
      };
    }
  };
}]);