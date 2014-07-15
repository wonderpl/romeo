angular.module('RomeoApp.directives')
  .directive('videoColorPicker', ['$templateCache', 'VideoService', '$timeout', function ($templateCache, VideoService, $timeout) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-color-picker.html'),
    scope : {
      videoId : '@'
    },
    controller : function ($scope) {

      function saveColor (color) {
        console.log(color);
        VideoService.setPlayerParameters($scope.videoId, {
          rgb : color
        });
      }

      var promise;

      $scope.$watch(
        function() { return $scope.color; },
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            $timeout.cancel(promise);
            promise = $timeout(function () { saveColor(newValue) }, 1000);
          }
        }
      );
    }
  };
}]);