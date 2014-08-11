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
    template : $templateCache.get('video-comments.html'),
    scope : {
      videoId : '@',
      currentTime : '=',
      comments : '=',
      notified : '=',
      isOwner: '='
    },
    link : function (scope, element, attrs) {
      scope.oldScrollTop = 0;
      scope.$watch(function () {
          return Math.round(scope.currentTime);
        },
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            var comments = getCommentsByTime(newValue);
            var sortedComments = comments.length ? comments.sort(sortById) : [];
            console.dir(sortedComments);
            if (sortedComments.length > 0) {
              scrollToComment('comment-' + sortedComments[0].id);
            }
          }
        }
      );

      function getCommentsByTime (time) {
        var filtered = [];
        var comments = scope.comments;
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

      function findCommentsOffsets(container) {
        var comments = {};
        var commentElements = container.find('li.video-feedback__comment');
        var startPosition = container.offset().top;
        console.log('start position: ' + startPosition);
        for (var i = 0; i < commentElements.length; ++i ) {
          var id = commentElements[i].attr('id');
          comments[id].position = getCommentElementById(commentElements[i].id).offset().top - startPosition;
          console.log('comment' + id + ': ' +comments[id].position);
        }
        return comments;
      }

      function scrollToComment (id) {
        console.log(element.find('#' + id).position().top);
        var container  = element.find('.video-feedback__comments-list').attr('id');
        element.find('#' + container).scrollTop(0);
        var pos = element.find('#' + id).position().top;
        element.find('#' + container).scrollTop(scope.oldScrollTop);
        element.find('#' + container).animate(
        {
          scrollTop: pos
        }, 1000);
        scope.oldScrollTop = pos;
        
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






