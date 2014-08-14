angular.module('RomeoApp.directives')
  .directive('videoCollaborators', ['$templateCache', 'CommentsService', 'CollaboratorsService', function ($templateCache, CommentsService, CollaboratorsService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video-collaborators.html'),
    scope : {
      videoId : '@',
      notified : '=',
      comments : '=',
      collaborators: '='
    },
    controller : function ($scope) {

      $scope.$watch(
        'videoId',
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            CollaboratorsService.getCollaborators(newValue).then(function (data) {
              $scope.collaborators = data.collaborator.items;
            });
          }
        }
      );

      $scope.notify = function () {
        CommentsService.notify($scope.videoId).then(function () {
          $scope.notified = true;
          $scope.$emit('notify', {
            status : 'success',
            title : 'Collaborators Notified',
            message : 'All collaborators have been sent notification of recent comments.'}
          );
        });
      };
    }
  };
}]);