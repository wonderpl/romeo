(function(){
  'use strict';

  function VideoPlayerDirective ($templateCache, $timeout) {

    var debug = new DebugClass('VideoPlayerDirective');

    var $frame;

    // http://support.ooyala.com/developers/documentation/api/player_v3_apis.html
    // https://www.pivotaltracker.com/story/show/75208950
    // ooyala players getDuration() function seems to occasionally
    // return duration in seconds instead of millseconds
    function durationHack (duration) {
      var isMilliseconds = (parseFloat(duration) === parseInt(duration, 10));
      debug.log('getDuration(): ', duration);
      debug.log('duration is milliseconds: ', isMilliseconds);
      return isMilliseconds ? duration : duration*1000;
    }

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/video-player.dir.html'),
      controller : function ($scope) {

        $scope.$watch('video.thumbnail_url', function (newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            updateImmediateCoverImage(newValue);
            restartPlayer();
          }
        });

        function updateImmediateCoverImage (thumbnail_url) {
          var img = $frame.find('#wonder-poster img');
          img.attr('src', thumbnail_url);
        }

        function restartPlayer () {
          var frame = $frame[0].contentDocument || $frame[0].contentWindow.document;
          var wrapper = frame.getElementById('wonder-wrapper');
          if (wrapper) {
            wrapper.dispatchEvent(new CustomEvent('restart'));
          }
        }

      },
      link : function (scope, elem, attrs) {

        $frame = $('.video-player__frame');

        function checkIFramePlayer () {
          var frame = $frame[0].contentWindow || $frame[0].contentDocument.parentWindow;
          if (frame) {
            if (frame.player) {
              scope.player = frame.player;
              scope.videoTotalTime = durationHack(scope.player.getDuration());
            }
            if (frame.OO && frame.OO.ready && scope.videoTotalTime > 0) {
              frame.OO.ready(function () {
                bindPlayerEvents(frame.OO);
              });
            }
          }

          if (!frame || !frame.player || !frame.OO || !frame.OO.ready || !scope.videoTotalTime) {
            pollIFrame();
          }
        }

        // http://support.ooyala.com/developers/documentation/concepts/xmp_securexdr_view_mbus.html
        // http://support.ooyala.com/developers/documentation/api/player_v3_api_events.html
        function bindPlayerEvents (OO) {
          var bus = scope.player.mb;
          bus.subscribe(OO.EVENTS.PLAYBACK_READY, 'WonderUIModule', function () {
          });
          bus.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'WonderUIModule', function(eventName, currentTime) {
            scope.videoCurrentTime = currentTime;
            scope.progress = (Math.round(((scope.videoCurrentTime * 1000)/scope.videoTotalTime) * 100 * 100))/100;
          });
          bus.subscribe(OO.EVENTS.SEEKED, 'WonderUIModule', function (seconds) {
            scope.player.pause();
          });
          bus.subscribe(OO.EVENTS.PAUSED, 'WonderUIModule', function () {
            scope.$broadcast('player-paused');
          });
          bus.subscribe(OO.EVENTS.PLAY, 'WonderUIModule', function () {
            scope.$broadcast('player-play');
          });
          bus.subscribe(OO.EVENTS.ERROR, 'WonderUIModule', function (code) {
            debug.log('player error ', code);
            scope.$emit('notify', {
              status : 'error',
              title : 'Video Player Error',
              message : 'Video player is experiencing technical issues.'}
            );
            scope.$broadcast('player-error');
          });
        }

        function pollIFrame () {
          $timeout(checkIFramePlayer, 1000);
        }

        pollIFrame();

      }
    };
  }

  angular.module('RomeoApp.directives').directive('videoPlayer', ['$templateCache', '$timeout', VideoPlayerDirective]);

})();

