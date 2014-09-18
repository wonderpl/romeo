(function () {

  'use strict';

  function playerEditor ($templateCache) {

    var $frame;

    return {
      replace: true,
      restrict: 'E',
      template : $templateCache.get('video/config/player-editor.tmpl.html'),
      scope: {
        playerParameters : '=',
        video : '='
      },
      link : function (scope, element, attrs) {

        $frame = $('.video-player__frame');

      },
      controller : function ($scope) {

        $scope.toggleHideLogo = function (event) {

          var isHide = $scope.playerParameters.hideLogo ? 'True' : 'False';
          var path = 'video.source_player_parameters.hideLogo';
          $frame[0].contentDocument.dispatchEvent(new CustomEvent('video-data-change', { detail : { path : path, data : isHide }}));
        };

        $scope.rgb = $scope.playerParameters.rgb;

        $scope.$watch('rgb', function (newValue, oldValue) {

          if (newValue && newValue !== oldValue) {
            $scope.playerParameters.rgb = newValue;
          }
        });
      }
    };
  }

  angular.module('RomeoApp.video').directive('playerEditor', ['$templateCache', playerEditor]);

})();