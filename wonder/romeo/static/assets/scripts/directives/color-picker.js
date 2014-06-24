angular.module('RomeoApp.directives', []).directive('colorPicker', function () {

  'use strict';


  // open -a Google\ Chrome --args --disable-web-security
  function shimChangesToIFrame () {

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" style="height: 0; width: 0;" id="ColourSvg"><filter id="ColourFilter" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR class="brightness red" type="linear" slope="1"/><feFuncG class="brightness green" type="linear" slope="1"/><feFuncB class="brightness blue" type="linear" slope="1"/></feComponentTransfer></filter></svg>';
    var style = '<style id="ColourStyle">.filtered { -webkit-filter : url("#ColourFilter"); }</style>';

    var frame = document.getElementsByClassName('video-player__frame')[0].contentDocument;
    var $frame = $(frame);

    var $play = $frame.find('.player-icon-play');
    $play.addClass('filtered');

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

      function spectrumOnChange (color) {
        scope.$apply(function () {
          ngModel.$setViewValue(color.toHexString());
        });
        var rgb = color.toRgb();
        shimChangesToIFrame();
        updateColours(rgb);
      }

      elem.spectrum({
        change: spectrumOnChange,
        move: spectrumOnChange,
        showButtons: false
      });

      ngModel.$render = function () {
        elem.spectrum('set', ngModel.$viewValue || '#fff');
      };
    }
  };
});
