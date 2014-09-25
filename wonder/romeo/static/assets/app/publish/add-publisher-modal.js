//add-publisher-modal.js

(function () {
'use strict';

function AddPublisherModal ($templateCache) {
  return {
    restrict: 'E',
    template : $templateCache.get('publish/add-publisher.modal.html'),
    scope: true
  };
}

angular.module('RomeoApp.publish')
  .directive('videoPublishAddPublisherModal', ['$templateCache', AddPublisherModal]);
})();