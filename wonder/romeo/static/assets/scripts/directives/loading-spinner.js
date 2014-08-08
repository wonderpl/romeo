angular
  .module('RomeoApp.directives')
  .directive('loadingSpinner', ['$templateCache', '$timeout', LoadingSpinnerDirective]);

function LoadingSpinnerDirective ($templateCache, $timeout) {
  'use strict';
  var $interval;

  return {
    restrict: 'A',
    compile: function(element) {
      $(element).append('<div class="spinner" style="display: none;"><div class="spinner--wrapper"><img src="/static/assets/img/loading_white_46x46.png" class="spinner--img" /></div></div>');
      $interval = 0;
      return {
        post: function postLink(scope, element, attrs, ctrl) {
          var visible = attrs.loadingSpinner;
          console.group('Post link:');
            console.log('Visible: ' + visible);
            console.group('Element');
              console.dir(element);
            console.groupEnd();
            console.group('Attributes');
              console.dir(attrs);
            console.groupEnd();
          console.groupEnd();

          scope.$watch(visible, function (value) {
            console.log('Spinner value changed to: ' + visible);
            $(element).find('.spinner').toggle(visible);
            if ($interval) {
              window.clearInterval($interval);
            }
            if (visible) {
              var elem = $(element).find('.spinner--img');
              $interval = window.setInterval(
                function() {
                  $(elem).css('top', parseInt($(elem).css('top')) < -820 ? '0px' : '-=46px');
                }, 600
              );
            }
          });
        }
      };
    }
  };
}