angular
  .module('RomeoApp.directives')
  .directive('loadingSpinner', ['$rootScope', LoadingSpinnerDirective]);

function LoadingSpinnerDirective ($rootScope) {
  'use strict';
  var $interval;

  return {
    restrict: 'A',
    compile: function(element) {
      $(element).append('<div class="spinner" style="display: none;"><div class="spinner--img"></div></div>');

      if (!$rootScope.loadingSpinnerInitialized ) {
        console.info('Initialied loading spinner');
        $rootScope.loadingSpinnerInitialized = true;
        $rootScope.loadingSpinnerPosition = 0;
        $rootScope.loadingSpinnerElements = [];
        
        window.setInterval(
          function() {
            $rootScope.loadingSpinnerPosition = $rootScope.loadingSpinnerPosition < -820 ? 0 : $rootScope.loadingSpinnerPosition - 46;
            for (var i = 0; i< $rootScope.loadingSpinnerElements.length; ++i) {
              $($rootScope.loadingSpinnerElements[i]).css('background-position-y', $rootScope.loadingSpinnerPosition + 'px');
            }
          }, 60
        );
      }

      return {
        post: function postLink(scope, element, attrs, ctrl) {
          scope.$watch(attrs, function (value) {
            var visible = attrs.loadingSpinner;
            if (visible === 'false')
              visible = false;
            if (visible) {
              $rootScope.loadingSpinnerElements.push($(element).find('.spinner--img'));
              $(element).find('.spinner').show();
            } else {
              for (var i = 0; i< $rootScope.loadingSpinnerElements.length; ++i) {
                if ($(element).find('.spinner--img') == $rootScope.loadingSpinnerElements[i]) {
                  $rootScope.loadingSpinnerElements = $rootScope.loadingSpinnerElements.splice(i, 1);
                }
              }
              $(element).find('.spinner').hide();
            }
          });
        }
      };
    }
  };
}