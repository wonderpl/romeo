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
      videoId : '@'
    },
    link : function (scope, elem, attrs) {

    },
    controller : function ($scope) {

      $scope.toggleHideLogo = function () {

        shimChangesToIFrame($scope.hideLogo);
        saveLogoSetting($scope.hideLogo);
      };

      function saveLogoSetting (hideLogo) {
        VideoService.setPlayerParameters($scope.videoId, {
          hideLogo : $scope.hideLogo,
          rgb : $scope.color
        });
      }

      function saveColor (color) {
        console.log(color);
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
            promise = $timeout(function () { saveColor(newValue) }, 1000);
          }
        }
      );
    }
  };
}]);