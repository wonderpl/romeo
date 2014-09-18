angular.module('RomeoApp.directives')
  .directive('videoNavigation', ['$templateCache', 'SecurityService', function ($templateCache, SecurityService) {
  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-navigation.html'),
    scope : {
      videoId : '=',
      flags: '=',
      videoStatus : '='
    },
    controller : function ($scope) {
      // $scope.isCollaborator = $root.isCollaborator;

      $scope.save = function () {
        $scope.$emit('video-save');
      };

      $scope.cancel = function () {
        $scope.$emit('video-cancel');
      };

      $scope.displaySection = function (section) {
        $scope.$emit('display-section', section);
      };

      $scope.isCollaborator = SecurityService.isCollaborator();
    },

    link : function (scope, elem, attr) {

      var stickyClass = 'sub-navigation--sticky';

      $(window).scroll(function(e) {
        if (e.currentTarget.scrollY > 45) {
          elem.addClass(stickyClass);
        } else {
          elem.removeClass(stickyClass);
        }
      });
    }
  };
}]);