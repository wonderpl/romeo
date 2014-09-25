(function () {

  'use strict';

  function modal ($templateCache) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/add-collaborator.modal.html'),
      scope : {
        showModal : '=',
        video : '=',
        modalSelection : '=',
        flags: '='
      }
    };
  }

  angular.module('RomeoApp.video').directive('videoAddCollaborator', ['$templateCache', modal]);

})();