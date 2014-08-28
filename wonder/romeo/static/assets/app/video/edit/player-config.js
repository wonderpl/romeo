angular.module('RomeoApp.directives')
  .directive('playerConfig', ['$templateCache', 'VideoService', function ($templateCache, VideoService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/edit/player-config.tmpl.html'),
    scope : {
      playerParameters : '=',
      videoId : '@',
      video : '='
    },
    controller : function ($scope) {

      $scope.config = { };

      function isOnlyWhiteSpaceContent (data) {

        return !!!$('<div></div>').html(data).text().replace(/\s/g, "").trim();
      }

      function shimChangesToIFrame (config) {

        console.log($scope.video.description);

        console.log(isOnlyWhiteSpaceContent($scope.video.description));

        var frame = document.getElementsByClassName('video-player__frame')[0].contentDocument;
        var $frame = $(frame);

        var hideLogo = config.hideLogo;
        var showBuyButton = config.showBuyButton && $scope.video.link_url && $scope.video && $scope.video.link_title;
        var showDescriptionButton = config.showDescriptionButton && $scope.video && !isOnlyWhiteSpaceContent($scope.video.description);

        var $controls = $frame.find('#wonder-controls');
        var $wrapper = $frame.find('#wonder-wrapper');

        if (hideLogo) {
          $controls.addClass('no-logo');
        } else {
          $controls.removeClass('no-logo');
        }

        if (showBuyButton) {
          $wrapper.addClass('show-buy-button');
          $frame.find('#wonder-buy-button').text($scope.video.link_title);
          $frame.find('#wonder-buy-button').attr('href', $scope.video.link_link);
        } else {
          $wrapper.removeClass('show-buy-button');
        }

        if (showDescriptionButton) {
          $wrapper.addClass('show-description-button');
        } else {
          $wrapper.removeClass('show-description-button');
        }
      }

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