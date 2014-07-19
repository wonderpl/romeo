angular.module('RomeoApp.directives')
  .directive('videoNavigation', ['$templateCache', '$rootScope', function ($templateCache, $rootScope) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-navigation.html'),
    scope : {
      isEdit : '='
    },
    controller : function ($scope) {

      $scope.save = function () {
        $rootScope.$emit('video-save');
      };

      $scope.cancel = function () {
        $rootScope.$emit('video-cancel');
      };

      $scope.displaySection = function (section) {
        console.log(section);
        $rootScope.$emit('display-section', section);
      };
    },

    link : function (scope, elem, attr) {

      var stickyClass = 'video-view-control-panel--sticky';

      $(window).scroll(function(e) {
        if (e.currentTarget.scrollY > 43) {
          elem.addClass(stickyClass);
        } else {
          elem.removeClass(stickyClass);
        }
      });
    }
  };
}]);