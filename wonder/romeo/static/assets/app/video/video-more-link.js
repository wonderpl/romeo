angular.module('RomeoApp.directives')
  .directive('videoMoreLink', ['$templateCache', '$rootScope', function ($templateCache, $rootScope) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/video-more-link.dir.html'),
    scope : {
      video : '='
    },
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