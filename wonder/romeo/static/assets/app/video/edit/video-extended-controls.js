angular.module('RomeoApp.video')
  .directive('videoExtendedControls', ['$templateCache', 'modal', function ($templateCache, modal) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/edit/video-extended-controls.dir.html'),
    scope : true,
    controller : function ($scope) {
      function init() {
        $scope.wonderTransferOptions = { onlyAllowDownload: true };
        setAvaliableTags($scope.tags);
      }
      $scope.showHideCollectionExtended = function() {
        $scope.$emit('show-hide-collection');
      };
      function setAvaliableTags(tags) {
        $scope.availableTags = [];
        angular.forEach(tags, function (val, key) {
          if (! val.public)
            $scope.availableTags.push(val);
        });
      }

      $scope.$watch('tags', function (newValue, oldValue) {
        if (! angular.equals(newValue, oldValue)) {
          setAvaliableTags(newValue);
        }
      });

      $scope.showModal = function (modalName) {
        modal.loadDirective(modalName, $scope);
      };
      init();
    }
  };
}]);