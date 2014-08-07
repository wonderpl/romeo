angular.module('RomeoApp.directives')
  .directive('uploadProgress', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('upload-progress.html'),
    scope: {
      upload : '='
    },
    controller : function ($scope, $element) {
      $scope.$watch(
        function() { return $scope.upload; },
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            console.log(newValue);
          }
        }
      );
    }
  };
}]);