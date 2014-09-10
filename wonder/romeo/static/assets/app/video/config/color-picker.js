(function () {

  'use strict';

  function colorPicker (VideoService) {

    return {
      scope : {
        rgb : '='
      },
      link: function (scope, elem, attrs) {

        function spectrumOnChange (color) {
          scope.rgb = color.toRgb();
          scope.$emit('update-player-parameters', { rgb : scope.rgb });
        }

        elem.spectrum({
          move: spectrumOnChange,
          showButtons: false,
          flat: true,
          showInput: true,
          preferredFormat: 'rgb'
        });

        elem.spectrum('set', scope.rgb || '#fff');
      }
    };
  }

  angular.module('RomeoApp.video.config').directive('colorPicker', ['VideoService', colorPicker]);

})();



