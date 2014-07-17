angular.module('RomeoApp.directives')
  .directive('videoComments', ['$rootScope', '$templateCache', 'CommentsService', '$timeout',
  function ($rootScope, $templateCache, CommentsService, $timeout) {

  'use strict';

  function createComment (data) {

// {
//     "avatar": "http://media.dev.rockpack.com/images/avatar/thumbnail_medium/kHmU0Pn5E1dVK3K68Okjgw.jpg",
//     "description": "Life Skills Coach, powered by emotional intelligence.",
//     "display_name": "Lynn Blades",
//     "href": "/api/account/14511293",
//     "name": "Lynn Blades",
//     "profile_cover": "http://media.dev.rockpack.com/images/profile/thumbnail_medium/kNxA6OFGIiMuQOESa05nLA.jpg"
// }

    var avatar = $rootScope.User.avatar;
    var username = $rootScope.User.display_name;

    var comment = {
      avatar_url  : avatar,
      comment     : '',
      datetime    : '',
      href        : '',
      id          : 0,
      timestamp   : null,
      username    : username
    };

    angular.extend(comment, data);

    // avatar_url: "http://www.gravatar.com/avatar/fd8a08918818436bfa110ef2d3b97834?s=48&d=mm"
    // comment: "xcvxzcv"
    // datetime: "2014-07-13T15:21:12.750463"
    // href: "/api/comment/1"
    // id: 1
    // timestamp: null
    // username: "noreply@wonderpl.com"

    return comment;
  }

  return {
    restrict : 'E',
    replace: true,
    template : $templateCache.get('video-comments.html'),
    scope : {
      videoId : '@',
      currentTime : '=',
      comments : '=',
      notified : '='
    },
    controller : function ($scope) {

      function getCommentById (id) {
        var comment;
        var comments = $scope.comments;
        var l = comments.length;
        while (l--) {
          if (comments[l].id === id) {
            comment = comments[l];
            break;
          }
        }
        return comment;
      }

      $scope.isOwner = true;

      $scope.$watch(
        function() { return $rootScope.User; },
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue && !jQuery.isEmptyObject(newValue)) {
            console.log(newValue);
            $scope.user = newValue;
          }
        }
      );

      $scope.$on('player-paused', videoOnPaused);

      function videoOnPaused (event, data) {
        $timeout(function () {
          $scope.inputActive = true;
          // UX no-no
          // window.scroll(0, $('.js-video-feedback-input').offset().top - 48);
        });
      }

      $scope.isTimeSync = function (timestamp) {
        var isTimeSync;
        if (!timestamp) {
          isTimeSync = false;
        } else {
          isTimeSync = Math.round(timestamp) === Math.round($scope.currentTime);
        }
        return isTimeSync;
      };

      $scope.resolve = function (commentId) {
        CommentsService.resolveComment($scope.videoId, commentId).then(function (data) {
          var comment = getCommentById(commentId);
          angular.extend(comment, data);
          // API bug
          comment.resolved = true;
        });
      };

      $scope.addComment = function () {

        var datetime = new Date().getTime();
        var commentData = {
          comment: $scope.commentText,
          timestamp: $scope.currentTime || 0,
          datetime: datetime.toString()
        };
        CommentsService.addComment($scope.videoId, commentData).then(function(data) {
          angular.extend(data, commentData);
          var comment = createComment(data);
          $scope.comments.push(comment);
          $scope.commentText = '';
          $scope.notified = false;
        });
      };

      $scope.reply = function (timestamp) {
        $scope.currentTime = timestamp;
        $scope.inputActive = true;
        $scope.videoSeek(timestamp);
      };

      $scope.videoSeek = function (timestamp) {
        $scope.$emit('video-seek', timestamp);
      };
    }
  };
}]);






