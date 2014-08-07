angular.module('RomeoApp.directives')
  .directive('videoShare', ['$templateCache', '$sce', 'VideoService', '$timeout', function ($templateCache, $sce, VideoService, $timeout) {

  'use strict';

  return {
    restrict : 'AE',
    replace : true,
    template : $templateCache.get('video-share.html'),
    scope : {
      video : '=',
      videoId : '@',
      hasTags : '@'
    },
    controller : function ($scope) {

      $scope.$watch('hasTags',function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          if (newValue === 'true') {
            VideoService.getEmbedCode($scope.videoId, { style : 'simple', width : '100', height : '100' }).then(function (data) {
              $scope.embedCode = data;
            });
          }
          $scope.videoIsPublic = videoIsPublic();
        }
      });

      $scope.shareFacebook = function () {

        VideoService.getShareUrl($scope.video.id, 'facebook').then(function (data) {

          ga('send', 'event', 'uiAction', 'share', 'facebook');

          var picture = $scope.video && $scope.video.thumbnails && $scope.video.thumbnails.items ? $scope.video.thumbnails.items[0] : null;

          FB.ui({
              method: 'feed',
              link: (data.url),
              picture: picture, // this is probably wrong
              name: 'WonderPL',
              caption: 'Shared a video with you'
          });
        });
      };

      $scope.shareTwitter = function () {

        VideoService.getShareUrl($scope.video.id, 'twitter').then(function (data) {

          ga('send', 'event', 'uiAction', 'share', 'twitter');

          window.open("http://twitter.com/intent/tweet?url=" + data.url);

        });
      };

      function videoIsPublic() {
        var tags = $scope.video.tags.items;
        for (var i = 0; i < tags.length; ++i) {
          if (tags[i].public === true || tags[i].public == 'public') {
            return true;
          }
        }
        return false;
      }
    }
  };
}]);