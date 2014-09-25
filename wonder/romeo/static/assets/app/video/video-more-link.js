angular.module('RomeoApp.directives')
  .directive('videoMoreLink', ['$templateCache', '$rootScope', function ($templateCache, $rootScope) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/video-more-link.dir.html'),
    scope : true,
    controller : function ($scope) {
      $scope.remaining = 30;
      var maxLength = 30;

      $scope.$watch('video.link_title', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          var newLength = newValue && newValue.length ? newValue.length : 0;
          $scope.remaining = maxLength - newLength;
          if ($scope.remaining < 0) {
            $scope.video.link_title = oldValue;
          }
          else {
            // Update player frame
            var frame = $('.video-player__frame')[0].contentDocument || $('.video-player__frame')[0].contentWindow.document;
            frame.dispatchEvent(new CustomEvent('video-data-change', { detail : { path : 'video.link_title', data : newValue }}));
          }
        }
      });

      $scope.$watch('video.link_url', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          // Update player frame
          var frame = $('.video-player__frame')[0].contentDocument || $('.video-player__frame')[0].contentWindow.document;
          frame.dispatchEvent(new CustomEvent('video-data-change', { detail : { path : 'video.link_url', data : newValue }}));
        }
      });

      $scope.save = function () {
        if ($scope.video.link_url && !$scope.video.link_url.match(/^http[s]?:\/\/.+/i)) {
          if ($scope.video.link_url.match(/^http[s]?:\/\/$/i)) {
            $scope.video.link_url = '';
          }
          else {
            $scope.video.link_url = 'http://' + $scope.video.link_url;
          }
        }
        $scope.showMoreLinkConfigPanel = false;
      };
    }
  };
}]);