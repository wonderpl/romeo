angular.module('RomeoApp.directives')
  .directive('videoComments', ['$rootScope', '$templateCache', 'CommentsService', '$timeout',
  function ($rootScope, $templateCache, CommentsService, $timeout) {

  'use strict';

  function createComment (data) {

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
        });
      };

      $scope.unresolve = function (commentId) {
        CommentsService.unresolveComment($scope.videoId, commentId).then(function (data) {
          var comment = getCommentById(commentId);
          angular.extend(comment, data);
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






