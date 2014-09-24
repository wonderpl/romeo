(function () {

  'use strict';

  function modal ($templateCache, VideoService) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/edit/video-properties.modal.html'),
      scope : {
        showModal : '=',
        video : '=',
        playerParameters : '=',
        modalSelection : '=',
        flags: '='
      },
      controller : function ($scope) {

        $scope.close = function ($event) {
          $scope.showModal = false;
          $scope.modalSelection = null;
        };

        $scope.$on('close-modal', function ($event) {
          $event.stopPropagation();
          $scope.showModal = false;
          $scope.modalSelection = null;
        });

        $scope.$on('video-saving', function ($event, data) {
          $scope.showModal = false;
          $scope.modalSelection = null;
        });
      }
    };
  }

  angular.module('RomeoApp.video').directive('videoPropertiesModal', ['$templateCache', 'VideoService', modal]);

})();



