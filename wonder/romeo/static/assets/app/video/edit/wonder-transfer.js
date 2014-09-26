(function () {
  'use strict';

  function WonderTransferModal ($templateCache, modal) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/edit/wonder-transfer.modal.html'),
      scope: true,
      controller: function ($scope) {
        $scope.save = function () {

          $scope.$emit('notify', {
            status : 'success',
            title : 'Wonder Transfer',
            message : 'Your invitation has been sent'}
          );
          modal.hide();
        };
      }
    };
  }

  angular.module('RomeoApp.video').directive('videoEditWonderTransfer', ['$templateCache', 'modal', WonderTransferModal]);

})();