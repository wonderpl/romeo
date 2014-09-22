angular.module('RomeoApp.directives')
  .directive('videoThumbnail', ['$templateCache', 'VideoService', '$location', '$sce', '$timeout',
  function ($templateCache, VideoService, $location, $sce, $timeout) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/video-thumbnail.dir.html'),
    link : function (scope, elem, attrs) {

      $timeout(function () {
        scope.previewIndex = 0;
      });

      scope.$watch("previewIndex", function (value) {
        value = constrain(value);
        if (scope.previewIndex !== value) {
          scope.previewIndex = value;
        }
        setCarouselPosition();
      });

      function constrain (value) {
        var items = scope.previewImages || [];
        var maxIndex = items.length > 0 ? items.length - 1 : 0;
        value = value < 0 ? 0 : value;
        value = value > maxIndex ? maxIndex : value;
        return value;
      }

      scope.updateIndex = function ($index) {
        scope.previewIndex = $index;
      };

      scope.showThumbnailSelector = false;

      function setCarouselPosition (position) {
        position = isNaN(position) ? scope.previewIndex : position;
        var $images = elem.find('.js-preview-images');
        var $firstImage = $images.find('li:first-child');
        var margin = parseInt($firstImage.css('marginRight'), 10);
        var imageWidth = $firstImage.width() + margin;
        var container = elem.parent();
        var containerWidth = container.width();
        var offset = (containerWidth - imageWidth)/2;
        var leftPosition = -(position * imageWidth) + offset;
        scope.indexOffset = { 'margin-left' : leftPosition + 'px' };
      }

      scope.selectThumbnail = function () {
        console.log('selectThumbnail()');
        scope.showThumbnailSelector = true;
        scope.previewIndex = 0;
        VideoService.getPreviewImages(scope.video.id).then(function(response){
          console.log(response);
          scope.previewImages = response.image.items;

          var items = scope.previewImages.length;

          // resize container to items * 500



        });
      };

      scope.uploadThumbnail = function () {
        console.log('uploadThumbnail()');
        console.log(scope.video);
      };

      scope.setBackground = function () {
        console.log('scope.previewImages()');
        var data = {
            time: scope.previewImages[scope.previewIndex].time
        };

        console.log(scope.previewImages);
        console.log(scope.previewImages[scope.previewIndex]);

        VideoService.setPreviewImage(scope.video.id, data).then(function() {
          console.log('VideoService.setPreviewImage - onSetPreviewImage');
          scope.onSetPreviewImage();
        });
      };
    }
  };
}]);