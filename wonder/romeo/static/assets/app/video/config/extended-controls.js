(function () {

  'use strict';

  function extendedControls ($templateCache) {

    return {
      replace: true,
      restrict: 'E',
      template : $templateCache.get('video/config/extended-controls.tmpl.html'),
      scope : {
        playerParameters : '='
      },
      controller : function ($scope) {

        $scope.updateShowBuyButton = function () {
          $scope.$emit('update-player-parameters', { showBuyButton : $scope.playerParameters.showBuyButton });
        };

        $scope.updateShowDescriptionButton = function () {
          $scope.$emit('update-player-parameters', { showDescriptionButton : $scope.playerParameters.showDescriptionButton });
        };
      }
    };
  }

  angular.module('RomeoApp.videoConfig').directive('extendedControls', ['$templateCache', extendedControls]);

})();