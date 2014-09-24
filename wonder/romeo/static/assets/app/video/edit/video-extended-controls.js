angular.module('RomeoApp.directives')
  .directive('videoExtendedControls', ['$templateCache', 'modal', function ($templateCache, modal) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/edit/video-extended-controls.dir.html'),
    scope : true,
    controller : function ($scope) {
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
      setAvaliableTags($scope.tags);

      $scope.$watch('tags', function (newValue, oldValue) {
        if (! angular.equals(newValue, oldValue)) {
          setAvaliableTags(newValue);
        }
      });

      $scope.showModal = function (modalName) {
        if (modalName == 'wonder-transfer') {
          modal.load('video/edit/wonder-transfer.modal.html', true, $scope);
        }
        else if (modalName == 'add-collaborator') {
          modal.load('video/add-collaborator.modal.html', true, $scope);
        }
        else if (modalName == 'add-to-collection') {
          modal.load('modal/add-to-collection.modal.html', true, $scope);
        }
        else {
          console.error('Unknown modal: ', modalName);
        }
      };
    }
  };
}]);