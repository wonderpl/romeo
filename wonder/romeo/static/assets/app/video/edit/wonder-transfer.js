(function () {

  'use strict';

  function modal ($templateCache) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/edit/wonder-transfer.modal.html'),
      scope : {
        showModal : '=',
        video : '=',
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
      }
    };
  }

  angular.module('RomeoApp.video').directive('videoEditWonderTransfer', ['$templateCache', modal]);

})();