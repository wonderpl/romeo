angular.module('RomeoApp.directives')
  .directive('videoComments', ['$rootScope', '$templateCache', 'CommentsService', '$timeout',
  function ($rootScope, $templateCache, CommentsService, $timeout) {

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
    restrict : 'E',
    replace: true,
    template : $templateCache.get('video-comments.html'),
    scope : {
      videoId : '@'
    },
    controller : function ($scope) {
      console.log($scope);
      if ($scope.videoId) {
        CommentsService.getComments($scope.videoId).then(function (data) {
          $scope.comments = data;
        });
      }
    },
    link : function(scope, elem, attrs) {





      // var time = scope.videoCurrentTime;
      // scope.$watch('videoCurrentTime', function(newValue, oldValue) {
      //   var temp = Math.round(newValue);
      //   var comments = scope.comments || [];
      //   var l = comments.length;
      //   while (l--) {
      //     scope.comments[l].isActive = (temp === comments[l].mark);
      //   }
      // }, true);


      // scope.$watchCollection('comments', function(newValue, oldValue) {

      //   console.log(newValue);

      //   console.log(oldValue);

      //   if (oldValue !== newValue) {

      //     var newComment = newValue[newValue.length - 1];

      //     console.log(newComment.mark);

      //     $timeout(function () {

      //       var $el = angular.element(document.querySelectorAll('.video-feedback__comment[data-mark="' + newComment.mark + '"]')[0]);

      //       var top = $el.position().top;

      //       console.log(top);

      //       document.querySelectorAll('.video-feedback__comments')[0].scrollIntoView();

      //       angular.element(document.querySelectorAll('.video-feedback__comments')[0]).scrollTop(top);

      //     }, 0);

      //   }

      // }, true);

      // scope.addComment = function () {

      //   var input = angular.element(elem[0].querySelector('.js-feeback-input'));
      //   var timestamp = getTimeStamp();
      //   var videoTime = Math.round(scope.videoCurrentTime); // get current time from video

      //   var comment = {
      //     name : 'user',
      //     mark : videoTime,
      //     posted : timestamp,
      //     comment : input.val(),
      //     position : (Math.round((scope.videoCurrentTime/(scope.videoTotalTime/1000)*10000))/100) + '%'
      //   };

      //   scope.comments.push(comment);

      //   scope.commentHover(videoTime);

      //   // CommentsService.addComment(comment).then(function (data) {
      //   //   scope.comments.push(data.comment);
      //   // });
      // };

      // scope.showReply = function (id) {
      //   var form = angular.element(elem[0].querySelector('.js-reply-form-' + id));
      //   form.addClass('video-feedback__reply-form--active');
      // };

      // scope.hideReply = function (id) {
      //   var form = angular.element(elem[0].querySelector('.js-reply-form-' + id));
      //   form.removeClass('video-feedback__reply-form--active');
      // };
    }
  };
}]);