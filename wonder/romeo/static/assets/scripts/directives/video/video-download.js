angular.module('RomeoApp.directives')
  .directive('videoDownload', function ($templateCache, $location, VideoService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-download.html'),
    scope : {
      videoId : '='
    },
    controller : function ($scope) {
      $scope.download = function () {
        VideoService.getDownloadUrl($scope.videoId).then(function (data) {
          $location.path(data.url);
        });
      };
    }
  };
});