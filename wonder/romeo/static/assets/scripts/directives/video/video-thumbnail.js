angular.module('RomeoApp.directives')
  .directive('videoThumbnail', ['$templateCache', 'VideoService', '$location', '$sce',
  function ($templateCache, VideoService, $location, $sce) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-thumbnail.html'),
    link : function (scope, elem, attrs) {

      scope.showThumbnailSelector = false;

      scope.selectThumbnail = function () {

        console.log('selectThumbnail()');

        console.log(scope.video);

        scope.showThumbnailSelector = true;

        VideoService.getPreviewImages(scope.video.id).then(function(response){

          scope.previewImages = response.image.items;
          scope.background = response.image.items[0].url;
          scope.previewIndex = 0;
        });
      };

      scope.uploadThumbnail = function () {

        console.log('uploadThumbnail()');

        console.log(scope.video);
      };

      scope.previousBackground = function () {

        var index = scope.previewIndex;

        var items = scope.previewImages;

        scope.previewIndex = index > 0 ? index - 1 : 0;

        scope.background =  items[scope.previewIndex].url;
      };

      scope.nextBackground = function () {

        var index = scope.previewIndex;

        var items = scope.previewImages;

        var maxIndex = items.length - 1;

        scope.previewIndex = index < maxIndex ? index + 1 : maxIndex;

        scope.background =  items[scope.previewIndex].url;
      };

      scope.setBackground = function () {

        var data = {
            time: scope.previewImages[scope.previewIndex].time
        };

        VideoService.setPreviewImage(scope.video.id, data);

        var url = '//' + $location.host() + ':' + $location.port() + '/embed/' + scope.video.id + '/?controls=1';

        scope.embedUrl = $sce.trustAsResourceUrl(url);

        scope.hasThumbnail = true;
      };
    }
  };
}]);