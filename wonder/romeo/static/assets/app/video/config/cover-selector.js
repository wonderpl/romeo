(function () {

  'use strict';

  function coverSelector ($templateCache, $timeout, VideoService) {

    return {
      replace: true,
      restrict: 'E',
      template : $templateCache.get('video/config/cover-selector.tmpl.html'),
      scope: {
        video : '='
      },
      link : function (scope, elem, attrs) {

        scope.$watch('previewIndex', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            newValue = constrain(newValue);
            if (scope.previewIndex !== newValue) {
              scope.previewIndex = newValue;
            }
            setCarouselPosition();
          }
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


      },
      controller : function ($scope) {

        $scope.previewIndex = 0;

        $scope.onCoverSelect = function (files) {

          $scope.$emit('notify', {
            status : 'info',
            title : 'Uploading Image',
            message : 'Thumbnail uploading.'}
          );

          VideoService.saveCustomPreview($scope.video.id, files[0]).then(function(data){

            $scope.$emit('close-modal');
            $scope.$emit('video-cover-image-updated', { url : data.thumbnail_url });

            $scope.$emit('notify', {
              status : 'success',
              title : 'Preview Image Updated',
              message : 'New preview image saved.'}
            );
          }, function () {
            $scope.$emit('notify', {
              status : 'error',
              title : 'Preview Image Update Error',
              message : 'Preview image not saved.'}
            );
          });
        };

        $scope.displaySelector = function () {
          $scope.showSelector = true;
        };

        $scope.incrementIndex = function () {
          $scope.previewIndex = $scope.previewIndex + 1;
        };

        $scope.decrementIndex = function () {
          $scope.previewIndex = $scope.previewIndex - 1;
        };

        $scope.$watch('video.id', function (newValue, oldValue) {
          if (newValue) {
            VideoService.getPreviewImages(newValue).then(function (data) {
              $scope.previewImages = data.image.items;
            });
          }
        });

        $scope.setBackground = function () {
          var data = {
              time: $scope.previewImages[$scope.previewIndex].time
          };
          VideoService.setPreviewImage($scope.video.id, data).then(function() {
            $scope.$emit('close-modal');
            $scope.$emit('video-cover-image-updated', {url : $scope.previewImages[$scope.previewIndex].url});
          });
        };
      }
    };
  }

  angular.module('RomeoApp.videoConfig').directive('coverSelector', ['$templateCache', '$timeout', 'VideoService', coverSelector]);

})();