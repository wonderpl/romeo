angular.module('RomeoApp.directives')
  .directive('videoIndicators', ['$templateCache', 'CommentsService',
  function ($templateCache, CommentsService) {

  'use strict';

  return {
    restrict : 'E',
    replace: true,
    template : $templateCache.get('video-indicators.html'),
    scope : {
      comments: '=',
      currentTime: '=',
      totalTime: '='
    },
    controller : function ($scope) {

      $scope.totalTimeInSeconds = $scope.totalTime || 0;

      $scope.$watch('totalTime', function(newValue, oldValue) {
        if (newValue && newValue >= 1) {
          $scope.totalTimeInSeconds = newValue ? newValue/1000 : 0;
          console.log($scope.totalTimeInSeconds);
        }
      });

      $scope.isTimeSync = function (timestamp) {
        var isTimeSync;
        if (!timestamp) {
          isTimeSync = false;
        } else {
          isTimeSync = Math.round(timestamp) === Math.round($scope.currentTime);
        }
        return isTimeSync;
      };

      $scope.seekByPosition = function (e) {
        var position = $(e.currentTarget).offset();
        var left = e.pageX - position.left;
        var width = $(e.currentTarget).width();
        var percentage = left/width;
        var time = $scope.totalTimeInSeconds * percentage;
        $scope.seek(time);
      };

      $scope.seek = function (timestamp) {
        $scope.$emit('video-seek', timestamp);
      };
    }
  };
}]);