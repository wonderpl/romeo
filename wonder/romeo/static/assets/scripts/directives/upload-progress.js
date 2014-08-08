angular.module('RomeoApp.directives')
  .directive('uploadProgress', ['$templateCache', '$location', function ($templateCache, $location) {

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
            $scope.isDimissed = false;
            console.log(newValue);
          }
        }
      );
      $scope.redirect = function (url) {
        console.log(url);
        $scope.isDimissed = true;
        $location.path(url);
      };
    }
  };
}]);