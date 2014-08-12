
angular
  .module('RomeoApp.directives')
  .directive('organiseVideoList', ['$templateCache', '$cookies', OrganiseVideoList]);



function OrganiseVideoList ($templateCache, $cookies) {
  'use strict';
  var debug = new DebugClass('OrganiseVideoList');

  function isVideoRecent (timestamp) {
    var currentTimestamp = new Date().getTime();
    var threshold = 24 * 60 * 60 * 1000; // 86400000
    var difference = currentTimestamp - timestamp;
    return difference < threshold;
  }

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-video-list.html'),
    scope : {
      videos : '=',
      tag : '=',
      customFilterFunction : '='
    },
    controller : function ($scope) {

      $scope.$watch('isList', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          $cookies.isList = newValue.toString();
        }
      });

      $scope.isList = $cookies.isList === 'true' ? true : false;

      function filterVideosByTagId (tagId) {
        var filteredVideos = [];
        var videos = $scope.videos || [];
        var l = videos.length;
        while (l--) {
          var tags = videos[l].tags && videos[l].tags.items ? videos[l].tags.items : [];
          var k = tags.length;
          while (k--) {
            if (parseInt(tags[k].id, 10) === tagId) {
              filteredVideos.push(videos[l]);
              break;
            }
          }
        }
        return filteredVideos;
      }
      $scope.$watch('videos', function (newValue, oldValue) {
        debug.log('Video changed but array the same');
        if (newValue !== oldValue) {
          debug.log('video data changed');
          $scope.filteredVideos = $scope.tag ? filterVideosByTagId($scope.tag.id) : newValue;
        }
      });
      $scope.$watch('tag', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          debug.log('tag data changed');
          $scope.filteredVideos = newValue ? filterVideosByTagId(newValue.id) : $scope.videos;
        }
      });

      $scope.$watch('customFilterFunction', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          $scope.customFilter = function (video) {
            if (newValue) {
              return $scope[newValue](video);
            } else {
              return true;
            }
          };
        }
      });

      $scope.isRecent = function (video) {
        var timestamp = new Date(video.date_updated).getTime();
        return isVideoRecent(timestamp);
      };
    }
  };
}
