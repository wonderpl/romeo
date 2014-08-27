angular.module('RomeoApp.directives')
  .directive('playerConfig', ['$templateCache', 'VideoService', function ($templateCache, VideoService) {

  'use strict';

  function shimChangesToIFrame (config) {

    var frame = document.getElementsByClassName('video-player__frame')[0].contentDocument;
    var $frame = $(frame);

    $frame.find('#wonder-controls').toggleClass('no-logo', config.hideLogo);
    $frame.find('#wonder-wrapper').toggleClass('show-buy-button', config.showBuyButton);
    $frame.find('#wonder-wrapper').toggleClass('show-description-button', config.showDescriptionButton);
  }

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/edit/player-config.tmpl.html'),
    scope : {
      playerParameters : '=',
      videoId : '@'
    },
    controller : function ($scope) {

      $scope.config = { };

      function persistChanges () {
        VideoService.setPlayerParameters($scope.videoId, {
          rgb                   : JSON.stringify($scope.config.color),
          hideLogo              : $scope.config.hideLogo,
          showBuyButton         : $scope.config.showBuyButton,
          showDescriptionButton : $scope.config.showDescriptionButton
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

      $scope.applyChanges = function () {
        shimChangesToIFrame($scope.config);
      };

      $scope.$watch(
        'playerParameters',
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            $scope.config.color = $scope.playerParameters.rgb;
            $scope.config.hideLogo = $scope.playerParameters.hideLogo;
            $scope.config.showBuyButton = $scope.playerParameters.showBuyButton;
            $scope.config.showDescriptionButton = $scope.playerParameters.showDescriptionButton;
          }
        }
      );
    }
  };
}]);