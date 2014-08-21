angular.module('RomeoApp.directives')
  .directive('videoColorPicker', ['$templateCache', 'VideoService', function ($templateCache, VideoService) {

  'use strict';

  function shimChangesToIFrame (hideLogo) {

    var frame = document.getElementsByClassName('video-player__frame')[0].contentDocument;
    var $frame = $(frame);

    var $logo = $frame.find('#wonder-controls');
    if (hideLogo) {

      $logo.addClass('no-logo');

    } else {

      $logo.removeClass('no-logo');
    }
  }

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-color-picker.html'),
    scope : {
      playerParameters : '=',
      videoId : '@'
    },
    controller : function ($scope) {

      function persistChanges () {
        VideoService.setPlayerParameters($scope.videoId, {
          hideLogo : $scope.hideLogo,
          rgb : JSON.stringify($scope.color)
        }).then(null, function () {
          $scope.$emit('notify', {
            status : 'error',
            title : 'Video Configuration Save Error',
            message : 'Your video player control changes have not been saved.'}
          );
        });
      }

      $scope.$on('video-saving', function ($event, data) {
        persistChanges();
      });

      $scope.toggleHideLogo = function () {
        shimChangesToIFrame($scope.hideLogo);
      };

      $scope.$watch(
        function() { return $scope.playerParameters; },
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            $scope.color = $scope.playerParameters.rgb;
            $scope.hideLogo = $scope.playerParameters.hideLogo;
          }
        }
      );
    }
  };
}]);