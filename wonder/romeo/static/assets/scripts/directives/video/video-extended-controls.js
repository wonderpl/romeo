angular.module('RomeoApp.directives')
  .directive('videoExtendedControls', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-extended-controls.html'),
    link : function (scope, elem, attrs) {

    },
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
    }
  };
}]);