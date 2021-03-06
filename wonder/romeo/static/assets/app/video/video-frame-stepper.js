angular.module('RomeoApp.video')
  .directive('videoFrameStepper', ['$templateCache',
  function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace: true,
    template : $templateCache.get('video/video-frame-stepper.dir.html'),
    scope : {
      currentTime: '='
    },
    controller : function ($scope) {

      $scope.videoTime = '00:00';

      $scope.$watch('currentTime', function() {

        var minutes = Math.floor($scope.currentTime/60);
        var seconds = Math.floor($scope.currentTime - minutes*60);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        $scope.videoTime = minutes + ':' + seconds;

      });

      $scope.seek = function (timestamp) {
        $scope.$emit('video-seek', timestamp);
      };

      $scope.step = function (modifier) {
        modifier = modifier || 0;
        var time = $scope.currentTime || 0;
        var timestamp = time + modifier;
        if (timestamp > 0) {
          $scope.$emit('video-seek', timestamp);
        }
      };
    }
  };
}]);