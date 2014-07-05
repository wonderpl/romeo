angular.module('RomeoApp.directives')
  .directive('videoThumbnail', ['$templateCache', 'VideoService', '$location', '$sce', '$timeout',
  function ($templateCache, VideoService, $location, $sce, $timeout) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-thumbnail.html'),
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
        console.log(scope.video);
        scope.showThumbnailSelector = true;
        scope.previewIndex = 0;
        scope.previewImages = scope.video.thumbnails.items;
        if (!scope.previewImages.length) {
          VideoService.getPreviewImages(scope.video.id).then(function(response){
            scope.previewImages = response.image.items;
            scope.background = response.image.items[0].url;
          });
        } else {
          scope.background = scope.previewImages[0].url;
        }
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
        return;

        // VideoService.setPreviewImage(scope.video.id, data).then(function() {
        //   scope.showPreviewSelector = false;
        //   scope.showThumbnailSelector = false;
        //   scope.showVideoEdit = true;
        //   // move this out somewhere
        //   var url = '//' + $location.host() + ':' + $location.port() + '/embed/' + scope.video.id + '/?controls=1';
        //   scope.embedUrl = $sce.trustAsResourceUrl(url);
        // });
      };
    }
  };
}]);