angular.module('RomeoApp.directives')
  .directive('organiseVideoList', ['$templateCache',
  function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-video-list.html'),
    scope : {
      videos : '=',
      tag : '='
    },
    controller : function ($scope) {

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
    }
  };
}]);