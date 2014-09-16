(function () {

  'use strict';

  function playerEditor ($templateCache) {

    return {
      replace: true,
      restrict: 'E',
      template : $templateCache.get('video/config/player-editor.tmpl.html'),
      scope: {
        playerParameters : '=',
        video : '='
      },
      controller : function ($scope) {

        $scope.toggleHideLogo = function (event) {
          $scope.$emit('update-player-parameters', { hideLogo : $scope.playerParameters.hideLogo });
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