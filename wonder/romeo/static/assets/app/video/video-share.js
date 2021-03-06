angular.module('RomeoApp.video')
  .directive('videoShare', ['$templateCache', '$sce', 'VideoService', function ($templateCache, $sce, VideoService) {

  'use strict';

  return {
    restrict : 'AE',
    replace : true,
    template : $templateCache.get('video/video-share.dir.html'),
    scope : {
      video : '='
    },
    link: function (scope, element, attr) {
      // Include facebook
      $('body').append('<div id="fb-root"></div>');
      window.fbAsyncInit = function() {
        FB.init({
          appId      : wonder.romeo.settings.facebook_app_id, // FB app id
          // channelUrl : 'YOUR_WEBSITE_CHANNEL_URL',
          status     : false, // check login status
          cookie     : false, // enable cookies to allow the server to access the session
          xfbml      : true  // parse XFBML
        });
      };

      (function(d){
         var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement('script'); js.id = id; js.async = true;
         js.src = "//connect.facebook.net/en_US/all.js";
         ref.parentNode.insertBefore(js, ref);
       }(document));
    },
    controller : function ($scope) {

      $scope.$watch('video.status',function (newValue, oldValue) {
        if (newValue !== oldValue) {
          setPublished(newValue);
        }
      });

      function setPublished(value) {
        $scope.videoIsPublic = (value === 'published');
        if ($scope.videoIsPublic) {
          VideoService.getEmbedCode($scope.video.id, { style : 'simple', width : '100', height : '100' }).then(function (data) {
            $scope.embedCode = data;
          });
        }
        else {
          $scope.embedCode = '';
        }
      }

      setPublished($scope.video.status);

      $scope.shareFacebook = function () {

        VideoService.getShareUrl($scope.video.id, 'facebook').then(function (data) {
          ga('send', 'event', 'uiAction', 'share', 'facebook');
          var fbParams = {
              method: 'feed',
              link: (data.url),
              name: 'WonderPL',
              caption: 'Shared a video with you'
          };

          if ($scope.video && $scope.video.thumbnails && $scope.video.thumbnails.items) {
            fbParams.picture = $scope.video.thumbnails.items[0].url;
          }
          FB.ui(fbParams);
        });
      };

      $scope.shareTwitter = function () {

        VideoService.getShareUrl($scope.video.id, 'twitter').then(function (data) {
          ga('send', 'event', 'uiAction', 'share', 'twitter');

          window.open("http://twitter.com/intent/tweet?url=" + data.url, 'twitter_popup', 'width=560, height=360');
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

