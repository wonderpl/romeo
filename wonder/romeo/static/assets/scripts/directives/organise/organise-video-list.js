
angular
  .module('RomeoApp.directives')
  .directive('organiseVideoList', ['$templateCache', OrganiseVideoList]);



function OrganiseVideoList ($templateCache) {
  'use strict';

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
      $scope.isList = false;
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
        if (newValue !== oldValue) {
          $scope.filteredVideos = $scope.tag ? filterVideosByTagId($scope.tag.id) : newValue;
        }
      });
      $scope.$watch('tag', function (newValue, oldValue) {
        if (newValue !== oldValue) {
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
      }
    }
  };
}
