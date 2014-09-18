
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
    template : $templateCache.get('organise/organise-video-list.tmpl.html'),
    scope : {
      collaborationVideos : '=',
      videos : '=',
      tag : '=',
      filterByRecent: '=',
      filterByCollaboration: '='
    },
    controller : function ($scope) {

      $scope.$watch('isList', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          $cookies.isList = newValue.toString();
        }
      });

      $scope.$watch('videos', function (newValue, oldValue) {
        if (! angular.equals(newValue, oldValue)) {
          debug.log('video data changed');
          $scope.filteredVideos = getFilteredVideoList();
        }
      });

      $scope.$watch('collaborationVideos', function (newValue, oldValue) {
        if (! angular.equals(newValue, oldValue)) {
          debug.log('collaboration videos data changed');
          $scope.filteredVideos = getFilteredVideoList();
        }
      });

      $scope.$watch('tag', function (newValue, oldValue) {
        if (! angular.equals(newValue, oldValue)) {
          debug.log('tag data changed');
          $scope.filteredVideos = getFilteredVideoList();
        }
      });

      $scope.$watch('filterByRecent', function (newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
          debug.log('filterByRecent changed');
          $scope.filteredVideos = getFilteredVideoList();
        }
      });

      $scope.$watch('filterByCollaboration', function (newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
          debug.log('filterByCollaboration changed');
          $scope.filteredVideos = getFilteredVideoList();
        }
      });

      function getFilteredVideoList() {
        if ($scope.filterByRecent)
          return filterVideosByRecent();
        else if ($scope.tag)
          return filterVideosByTagId($scope.tag.id);
        else if ($scope.filterByCollaboration)
          return filterVideosByCollaboration();
        return $scope.videos;
      }

      $scope.isList = $cookies.isList === 'true' ? true : false;

      function filterVideosByTagId (tagId) {
        var filteredVideos = [];
        angular.forEach($scope.videos, function (video, key) {
          angular.forEach(video.tags.items, function (tag, key) {
            if (parseInt(tag.id, 10) === tagId) {
              filteredVideos.push(video);
            }
          });
        });
        return filteredVideos;
      }

      function filterVideosByRecent() {
        var filteredVideos = [];
        angular.forEach($scope.videos, function (video, key) {
          if ($scope.isRecent(video)) {
            filteredVideos.push(video);
          }
        });
        return filteredVideos;
      }

      function filterVideosByCollaboration () {
        return $scope.collaborationVideos;
      }

      $scope.isRecent = function (video) {
        var timestamp = new Date(video.date_updated).getTime();
        return isVideoRecent(timestamp);
      };
    }
  };
}
