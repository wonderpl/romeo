//add-publisher-modal.js
(function () {
'use strict';

function AddPublisherModal ($templateCache, modal) {
  return {
    restrict: 'E',
    template : $templateCache.get('publish/add-publisher.modal.html'),
    scope: true,
    controller: function ($scope) {
      $scope.save = function () {
        $scope.$emit('notify', {
          status : 'success',
          title : 'Invite publisher',
          message : 'Your publisher invitation has been sent'}
        );
        modal.hide();
      };
    }
  };
}

angular.module('RomeoApp.publish')
  .directive('videoPublishAddPublisherModal', ['$templateCache', 'modal', AddPublisherModal]);
})();