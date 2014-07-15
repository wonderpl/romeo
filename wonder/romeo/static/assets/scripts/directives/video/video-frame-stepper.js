angular.module('RomeoApp.directives')
  .directive('videoFrameStepper', ['$templateCache',
  function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace: true,
    template : $templateCache.get('video-frame-stepper.html'),
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
        var time = $scope.currentTime || 0;
        $scope.$emit('video-seek', time + modifier);
      };
    }
  };
}]);