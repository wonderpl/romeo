angular.module('RomeoApp.directives')
  .directive('videoShare', ['$templateCache', '$sce', 'VideoService', function ($templateCache, $sce, VideoService) {

  'use strict';

  return {
    restrict : 'AE',
    replace : true,
    template : $templateCache.get('video-share.html'),
    scope : {
      video : '='
    },
    controller : function ($scope) {

      VideoService.getEmbedCode($scope.video.id).then(function (data) {
        $scope.embedCode = '<iframe src="' + data + '" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>';
      });


      $scope.shareFacebook = function () {

        VideoService.getShareUrl($scope.video.id, 'facebook').then(function () {

          ga('send', 'event', 'uiAction', 'share', 'facebook');

          FB.ui({
              method: 'feed',
              link: ( 'http://wonderpl.com/channel/-/' + '$rootScope.channel_data.id' + '/?video=' + $scope.video.id), // where does channel come from?
              picture: $scope.video.thumbnails.items[0], // this is probably wrong
              name: 'WonderPL',
              caption: 'Shared a video with you'
          });
        });
      };

      $scope.shareTwitter = function () {

        VideoService.getShareUrl($scope.video.id, 'twitter').then(function (data) {

          ga('send', 'event', 'uiAction', 'share', 'twitter');

          window.open("http://twitter.com/intent/tweet?url=" + data;

        });
      };
    }
  };
}]);