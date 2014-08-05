angular
  .module('RomeoApp.directives')
  .directive('organiseVideo', ['$templateCache', '$modal', OrganiseVideo]);

function OrganiseVideo ($templateCache, $modal) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-video.html'),
    scope : {
      video : '=',
      isList : '='
    },
    controller : function ($scope) {
      $scope.delete = function (video) {
        $modal.hide();
        $scope.$emit('delete-video', video);
      };
      $scope.showDelete = function (video) {
        $scope.video = video;
        $modal.load('modal-delete-video.html', true, $scope, {});
      };
      $scope.addRemove = function (video) {
        $scope.$emit('add-remove-video', video);
      };
      $scope.close = function () {
        $modal.hide();
      };
    }
  };
}