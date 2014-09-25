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
      }
    };
  }

  angular.module('RomeoApp.video').directive('videoEditWonderTransfer', ['$templateCache', modal]);

})();