angular.module('RomeoApp.directives')
  .directive('videoColorPicker', ['$templateCache', 'VideoService', '$timeout', function ($templateCache, VideoService, $timeout) {

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
    link : function (scope, elem, attrs) {

    },
    controller : function ($scope) {

      $scope.toggleHideLogo = function () {
        console.log($scope.hideLogo);
        shimChangesToIFrame($scope.hideLogo);
        saveLogoSetting($scope.hideLogo);
      };

      function saveLogoSetting (hideLogo) {
        VideoService.setPlayerParameters($scope.videoId, {
          hideLogo : $scope.hideLogo,
          rgb : JSON.stringify($scope.color)
        });
      }

      function saveColor (color) {
        VideoService.setPlayerParameters($scope.videoId, {
          hideLogo : $scope.hideLogo,
          rgb : JSON.stringify($scope.color)
        });
      }

      var promise;

      $scope.$watch(
        function() { return $scope.color; },
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            $timeout.cancel(promise);
            promise = $timeout(function () { saveColor(newValue); }, 1000);
          }
        }
      );

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