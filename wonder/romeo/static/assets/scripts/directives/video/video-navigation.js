angular.module('RomeoApp.directives')
  .directive('videoNavigation', ['$templateCache', function ($templateCache) {
  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-navigation.html'),
    scope : {
      isEdit : '=',
      isReview : '=',
      isOwner : '=',
      isComments : '=',
      videoId : '=',
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
        $rootScope.$emit('display-section', section);
      };
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