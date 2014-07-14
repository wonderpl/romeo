angular.module('RomeoApp.directives')
  .directive('videoIndicators', ['$rootScope', '$templateCache', 'CommentsService', '$timeout',
  function ($rootScope, $templateCache, CommentsService, $timeout) {

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

      $scope.isTimeSync = function (timestamp) {
        return Math.round(timestamp) === Math.round($scope.currentTime);
      };

      $scope.seek = function (timestamp) {
        $scope.$emit('video-seek', timestamp);
      };
    }
  };
}]);