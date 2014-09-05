(function () {

  'use strict';

  function modal ($templateCache, VideoService) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/config/modal.tmpl.html'),
      scope : {
        showModal : '=',
        video : '=',
        playerParameters : '='
      },
      controller : function ($scope) {

        $scope.close = function ($event) {
          if ($event.currentTarget === $event.target) {
            $scope.showModal = false;
          }
        };

        $scope.showSection = function (section) {
          $scope.selection = section;
        };

        $scope.$on('close-modal', function ($event) {
          $event.stopPropagation();
          $scope.showModal = false;
        });

        $scope.$on('video-saving', function ($event, data) {
          $scope.showModal = false;
        });
      }
    };
  }

  angular.module('RomeoApp.videoConfig').directive('videoModal', ['$templateCache', 'VideoService', modal]);

})();



