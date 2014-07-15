angular.module('RomeoApp.directives', []).directive('colorPicker', function () {

  'use strict';

  function shimChangesToIFrame () {

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" style="height: 0; width: 0;" id="ColourSvg"><filter id="ColourFilter" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR class="brightness red" type="linear" slope="1"/><feFuncG class="brightness green" type="linear" slope="1"/><feFuncB class="brightness blue" type="linear" slope="1"/></feComponentTransfer></filter></svg>';
    var style = '<style id="ColourStyle">.filtered { -webkit-filter : url("#ColourFilter"); -webkit-transform: translate3d(0px,0px,0px); -webkit-backface-visibility: hidden; -webkit-perspective: 1000; }</style>';

    var frame = document.getElementsByClassName('video-player__frame')[0].contentDocument;
    var $frame = $(frame);

    var $filteredControls = $frame.find('.wonder-play, .wonder-pause, .wonder-volume, .wonder-logo, .wonder-fullscreen, .scrubber-handle');
    $filteredControls.addClass('filtered');

    var $svg = $frame.find('#ColourSvg');
    if (!$svg.length) {
      var $frameBody = $frame.find('body');
      $svg = $(svg);
      $frameBody.prepend($svg);
    }

    var $style = $frame.find('#ColourStyle');
    if (!$style.length) {
      var $frameHead = $frame.find('head');
      $style = $(style);
      $frameHead.append($style);
    }
  }

  function updateColours (rgb) {

    var frame = document.getElementsByClassName('video-player__frame')[0].contentDocument;
    var $frame = $(frame);

    var $svg = $frame.find('#ColourSvg');

    $svg.find('.red').attr('slope', rgb.r/255);
    $svg.find('.green').attr('slope', rgb.g/255);
    $svg.find('.blue').attr('slope', rgb.b/255);
  }

  return {
    require: '?ngModel',
    link: function (scope, elem, attrs, ngModel) {

      scope.$watch(
      function() { return scope.color; },
      function(newValue, oldValue) {
        if (newValue && (newValue !== oldValue)) {
          console.log(newValue);
          updateColours(newValue);
        }
      });

      function spectrumOnChange (color) {
        scope.$apply(function () {
          ngModel.$setViewValue(color.toRgb());
        });
        var rgb = color.toRgb();
        shimChangesToIFrame();
        updateColours(rgb);
      }

      elem.spectrum({
        change: spectrumOnChange,
        move: spectrumOnChange,
        showButtons: false,
        flat: true,
        showInput: true,
        preferredFormat: 'rgb',
        color: scope.color
      });

      ngModel.$render = function () {
        elem.spectrum('set', ngModel.$viewValue || '#fff');
      };
    }
  };
});
