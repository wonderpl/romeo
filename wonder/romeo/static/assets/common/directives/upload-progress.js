angular.module('RomeoApp.directives')
  .directive('uploadProgress', ['$templateCache', 'UploadService', function ($templateCache, UploadService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('directives/upload-progress.dir.html'),
    scope: {
      upload : '='
    },
    controller : function ($scope, $element) {
      $scope.$watch(
        function() { return UploadService.uploadProgress(); },
        function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.progress = newValue;
          }
        }
      );
      $scope.$watch(
        function() { return UploadService.uploadStatus(); },
        function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.status = newValue;
          }
        }
      );
      $scope.status = UploadService.uploadStatus();
    }
  };
}]);