(function () {

  'use strict';

  function AddToCollection ($templateCache, modal) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('modal/add-to-collection.modal.html'),
      scope : {
        showModal : '=',
        video : '=',
        modalSelection : '=',
        flags: '='
      },
      controller : function ($scope) {
        $scope.close = function ($event) {
          modal.hide();
        };
      }
    };
  }

  angular.module('RomeoApp.modal').directive('modalAddToCollection', ['$templateCache', 'modal', AddToCollection]);

})();