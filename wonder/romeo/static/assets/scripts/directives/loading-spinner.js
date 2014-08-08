angular
  .module('RomeoApp.directives')
  .directive('loadingSpinner', ['$templateCache', '$timeout', LoadingSpinnerDirective]);

function LoadingSpinnerDirective ($templateCache, $timeout) {
  'use strict';
  return {
    restrict: 'A',
    compile: function(element) {
      $(element).append('<div class="spinner" style="display: none;"><div class="spinner--wrapper"><img src="/static/assets/img/loading_white_46x46.png" class="spinner--img" /></div></div>');
      $interval = 0;
    },
    link: function (scope, element, attrs) {
      element.data('$visible', attr.loadingSpinner);
      scope.$watch($visible, function (value) {
        $(element).find('.spinner').toggle($visible);
        if ($interval) {
          window.clearInterval($interval);
        }
        if ($visible) {
          var elem = $(element).find('.spinner--img');
          $interval = window.setInterval(function() {
            $(elem).css('top', parseInt($(elem).css('top')) < -820 ? '0px' : '-=46px');
          }, 60);
        }
      });
    }
  };
}