angular.module('RomeoApp.video')
  .directive('videoComments', ['$templateCache', '$timeout', 'UserService', 'SecurityService', 'CommentsService',
  function ($templateCache, $timeout, UserService, SecurityService, CommentsService) {

  'use strict';

  function createComment (data) {

    var avatar = UserService.getUser().avatar;
    var username = UserService.getUser().display_name;

    var comment = {
      avatar  : avatar,
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

  // http://stackoverflow.com/a/1129270
  function sortById(a, b) {
    if (a.id < b.id)
       return -1;
    if (a.id > b.id)
      return 1;
    return 0;
  }

  return {
    restrict : 'E',
    replace: true,
    template : $templateCache.get('video/collaborate/video-comments.dir.html'),
    scope : true,
    link : function (scope, element, attrs) {
      scope.$watch(function () {
          return Math.round(scope.videoCurrentTime) || scope.videoCurrentTime === 0.0;
        },
        function(newValue, oldValue) {
          if (newValue !== oldValue) {

            var comments = getCommentsByTime((newValue < 1) ? 0.0 : newValue);
            var sortedComments = comments.length ? comments.sort(sortById) : [];
            if (sortedComments.length > 0) {
              scrollToComment('comment-' + sortedComments[0].id);
            }
          }
        }
      );

      function getCommentsByTime (time) {
        var filtered = [];
        var comments = scope.comments || [];
        var l = comments.length;
        while (l--) {
          if (comments[l].timestamp === time) {
            filtered.push(comments[l]);
          }
        }
        return filtered;
      }

      function getCommentElementById (id) {
        return element.find('#' + id);
      }

      function scrollToComment (id) {
        var container  = element.find('.video-feedback__comments-list').attr('id');
        var oldScrollTop = element.find('#' + container).scrollTop(); // Get current scroll position
        var pos = 0;
        pos = element.find('#' + id).position().top + oldScrollTop;
        element.find('#' + container).animate(
        {
          scrollTop: pos
        }, 1000);

      }

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

      $scope.$on('player-paused', videoOnPaused);
      $scope.$on('player-play', videoOnPlay);

      function videoOnPaused (event, data) {
        $timeout(function () {
          $scope.inputActive = true;
        });
      }

      function videoOnPlay (event, data) {
        $timeout(function () {
          $scope.inputActive = false;
        });
      }

      $scope.isTimeSync = function (timestamp) {
        var isTimeSync;
        if (!timestamp) {
          isTimeSync = false;
        } else {
          isTimeSync = Math.round(timestamp) === Math.round($scope.videoCurrentTime);
        }
        return isTimeSync;
      };

      $scope.resolve = function (commentId) {
        CommentsService.resolveComment($scope.video.id, commentId).then(function (data) {
          var comment = getCommentById(commentId);
          angular.extend(comment, data);
        });
      };

      $scope.unresolve = function (commentId) {
        CommentsService.unresolveComment($scope.video.id, commentId).then(function (data) {
          var comment = getCommentById(commentId);
          angular.extend(comment, data);
        });
      };

      $scope.addComment = function () {

        var datetime = new Date().getTime();
        var commentData = {
          comment: $scope.commentText,
          timestamp: $scope.videoCurrentTime || 0,
          datetime: datetime.toString()
        };
        CommentsService.addComment($scope.video.id, commentData).then(function(data) {
          angular.extend(data, commentData);
          var comment = createComment(data);
          if (comment.timestamp)
            comment.timestamp = Math.round(comment.timestamp); // Make sure we have an int for the timestamp otherwise comment scrolling breaks
          $scope.comments.push(comment);
          $scope.commentText = '';
          $scope.flags.notified = false;
        });
      };

      $scope.reply = function (timestamp) {
        $scope.videoCurrentTime = timestamp;
        $scope.inputActive = true;
        $scope.videoSeek(timestamp);
      };

      $scope.videoSeek = function (timestamp) {
        $scope.$emit('video-seek', timestamp);
      };
      $scope.isCollaborator = function () {
        return SecurityService.isCollaborator();
      };
      $scope.isLoggedIn = function () {
        return SecurityService.isAuthenticated();
      };
      $scope.user = function () {
        return UserService.getUser();
      };
    }
  };
}]);






