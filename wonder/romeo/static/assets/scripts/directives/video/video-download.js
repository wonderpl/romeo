angular
  .module('RomeoApp.directives')
  .directive('videoDownload', ['$templateCache', '$location', 'VideoService', '$q', VideoDownloadDirective]);

function VideoDownloadDirective ($templateCache, $location, VideoService, $q) {

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
        VideoService.getDownloadUrl($scope.videoId)
        .then(function (data) {
          window.location = data.url;
        });
      };
    }
  };
}