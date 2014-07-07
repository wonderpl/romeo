angular.module('RomeoApp.directives')
  .directive('videoShare', ['$templateCache', '$sce', function ($templateCache, $sce) {

  'use strict';

  return {
    restrict : 'AE',
    replace : true,
    template : $templateCache.get('video-share.html'),
    link : function (scope, elem, attrs) {

      scope.shareFacebook = function () {

        console.log('THESE ARE NOT THE CORRECT PARAMETERS');

        ga('send', 'event', 'uiAction', 'share', 'facebook');

        FB.ui({
            method: 'feed',
            link: ( 'http://wonderpl.com/channel/-/' + $rootScope.channel_data.id + '/?video=' + $rootScope.videos[$rootScope.currentvideo].id),
            picture: $rootScope.videos[$rootScope.currentvideo].video.thumbnail_url,
            name: 'WonderPL',
            caption: 'Shared a video with you'
        });
      };

      scope.shareTwitter = function () {

        console.log('THESE ARE NOT THE CORRECT PARAMETERS');

        ga('send', 'event', 'uiAction', 'share', 'twitter');
        window.open("http://twitter.com/intent/tweet?url=" + $rootScope.shareurl);
      };
    }
  };
}]);