angular.module('RomeoApp.directives')
  .directive('videoCollaborators', ['$templateCache', 'CommentsService', 'CollaboratorsService', function ($templateCache, CommentsService, CollaboratorsService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-collaborators.html'),
    scope : {
      videoId : '@'
    },
    controller : function ($scope) {


    $scope.$watch(
      'videoId',
      function(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          CollaboratorsService.getCollaborators(newValue).then(function (data) {
            $scope.collaborators = data.items;
          });
        }
      }
    );

      $scope.notify = function () {
        CommentsService.notify($scope.videoId).then(function () {
          $scope.notified = true;
        });
      };
    }
  };
}]);