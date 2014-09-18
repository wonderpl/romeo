(function () {

  'use strict';

  function extendedControls ($templateCache) {

    var $frame;

    return {
      replace: true,
      restrict: 'E',
      template : $templateCache.get('video/config/extended-controls.tmpl.html'),
      scope : {
        playerParameters : '='
      },
      link : function (scope, elem, attrs) {

        $frame = $('.video-player__frame');
      },
      controller : function ($scope) {

        $scope.updateShowBuyButton = function () {

          var data = $scope.playerParameters.showBuyButton ? 'True' : 'False';
          var path = 'video.source_player_parameters.showBuyButton';
          $frame[0].contentDocument.dispatchEvent(new CustomEvent('video-data-change', { detail : { path : path, data : data }}));
        };

        $scope.updateShowDescriptionButton = function () {

          var data = $scope.playerParameters.showDescriptionButton ? 'True' : 'False';
          var path = 'video.source_player_parameters.showDescriptionButton';
          $frame[0].contentDocument.dispatchEvent(new CustomEvent('video-data-change', { detail : { path : path, data : data }}));
        };
      }
    };
  }

  angular.module('RomeoApp.video').directive('extendedControls', ['$templateCache', extendedControls]);

})();