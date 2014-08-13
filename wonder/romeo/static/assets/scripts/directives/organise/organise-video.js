angular
  .module('RomeoApp.directives')
  .directive('organiseVideo', ['$templateCache', '$modal', OrganiseVideo]);

function OrganiseVideo ($templateCache, $modal) {
  'use strict';
  var debug = new DebugClass('OrganiseVideo');
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-video.html'),
    scope : {
      video : '=',
      isList : '='
    },
    controller : function ($scope) {
      $scope.delete = function (video) {
        $modal.hide();
        $scope.$emit('delete-video', video);
      };
      $scope.showDelete = function (video) {
        $scope.video = video;
        $modal.load('modal-delete-video.html', true, $scope, {});
      };
      $scope.addRemove = function (video) {
        $scope.$emit('add-remove-video', video);
      };
      $scope.close = function () {
        $modal.hide();
      };
      $scope.$watch('video.status', function(newValue, oldValue) {
        debug.log('Video status ' + $scope.video.title + (newValue === oldValue ? ' is the same as before ' : ' changed to ') + newValue);
        $scope.thumbnail = getThumbnail();
      });

      function getThumbnail() {
        var thumbs = $scope.video.thumbnails.items;
        var thumbnail = 'http://cf.c.ooyala.com/d5Ymkwbzpnzj05yZGaGDFkj5Qfz6lB5C/Ut_HKthATH4eww8X4xMDoxOjBhOzV3Va'; // Default (88888888) thumbnail

        if ($scope.video.status == 'uploading') {
          thumbnail = '/static/assets/img/video-list-states/uploading.png';
        } else if ($scope.video.status == 'processing') {
          thumbnail = '/static/assets/img/video-list-states/processing.png';
        } else if ($scope.video.status == 'error') {
          thumbnail = '/static/assets/img/video-list-states/error.png';
        } else if (thumbs.length > 0 && thumbs[0].width !== 0) {
          thumbnail = thumbs[0].url;
        }

        for (var i =0; i < thumbs.length; ++i) {
          if (thumbs[i].height == 180) {
            return thumbs[i].url;
          }
        }
        return thumbnail;
      }
      $scope.thumbnail = getThumbnail();
    }
  };
}