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
      comments : '='
    },
    controller : function ($scope) {

      $scope.isOwner = true;

      $scope.$watch(
        function() { return $rootScope.User; },
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            console.log(newValue);
            $scope.test = newValue;
          }
        }
      );


      $scope.isTimeSync = function (timestamp) {
        var isTimeSync;
        if (!timestamp) {
          isTimeSync = false;
        } else {
          isTimeSync = Math.round(timestamp) === Math.round($scope.currentTime);
        }
        return isTimeSync;
      };

      $scope.resolve = function (id) {

        console.log('resolve()');
        console.log(id);
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

      $scope.notify = function () {
        CommentsService.notify($scope.videoId);
      };
    }
  };
}]);






