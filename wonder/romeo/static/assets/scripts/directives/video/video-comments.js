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
      currentTime : '='
    },
    controller : function ($scope) {

      $scope.$watch(
        function() { return $scope.videoId; },
        function(newValue, oldValue) {
          if (newValue !== '' && newValue !== oldValue) {
            CommentsService.getComments($scope.videoId).then(function (data) {
              console.log(data);
              $scope.comments = data.comment.items;
            });
          }
        }
      );

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
        });
      };
    }
  };
}]);