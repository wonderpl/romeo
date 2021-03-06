(function () {

  'use strict';

  function colorPicker (VideoService) {

    return {
      scope : {
        rgb : '='
      },
      link : function (scope, elem, attrs) {
        var path = 'video.source_player_parameters.rgb';
        elem.spectrum({
          showButtons: false,
          flat: true,
          showInput: true,
          preferredFormat: 'rgb',
          move: function (color) {
            var rgb = scope.rgb = color.toRgb();
            var data = {
              r : rgb.r,
              g : rgb.g,
              b : rgb.b,
              a : 1
            };
            var $frame = $('.video-player__frame');
            var frame = $frame[0].contentDocument || $frame[0].contentWindow.document;
            frame.dispatchEvent(new CustomEvent('video-data-change', { detail : { path : path, data : JSON.stringify(data) }}));
          }
        });

        elem.spectrum('set', scope.rgb || '#fff');
      }
    };
  }

  angular.module('RomeoApp.video').directive('colorPicker', ['VideoService', colorPicker]);

})();



