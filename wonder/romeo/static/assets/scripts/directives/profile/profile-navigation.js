
angular.module('RomeoApp.directives')
  .directive('profileNavigation', ['$templateCache', ProfileNavigationDirective]);

function ProfileNavigationDirective ($templateCache) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile-navigation.html'),
    scope : {
      isEdit : '='
    },
    controller : function ($scope) {
      $scope.save = function () {
        $scope.$emit('profile-save');
      };
      $scope.cancel = function () {
        $scope.$emit('profile-cancel');
      };
    },
    link : function (scope, elem, attr) {
      var stickyClass = 'sub-navigation--sticky';
      $(window).scroll(function(e) {
        if (e.currentTarget.scrollY > 57) {
          elem.addClass(stickyClass);
        } else {
          elem.removeClass(stickyClass);
        }
      });
    }
  };
}
