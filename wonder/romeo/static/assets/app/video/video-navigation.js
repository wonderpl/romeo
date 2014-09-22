angular.module('RomeoApp.directives')
  .directive('videoNavigation', ['$templateCache', 'VideoService', 'SecurityService', function ($templateCache, VideoService, SecurityService) {
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

      $scope.copyToAccount = function () {
        if ($scope.videoId) {
          VideoService.copyToAccount($scope.videoId).then(function (res) {
            $scope.$emit('notify', {
              status : 'success',
              title : 'Video copy',
              message : 'Video successfully copied to your account'}
            );
          }, function (res) {
            debug.error(res.error);
            $scope.$emit('notify', {
              status : 'error',
              title : 'Video copy',
              message : 'Failed to copy to your account'}
            );
          });
        }
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