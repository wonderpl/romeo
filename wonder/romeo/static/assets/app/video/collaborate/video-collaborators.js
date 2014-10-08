(function () {

  'use strict';

  angular.module('RomeoApp.video')
    .directive('videoCollaborators', ['$templateCache', '$timeout', 'CommentsService', 'CollaboratorsService', 'UserService', 'modal',
    function ($templateCache, $timeout, CommentsService, CollaboratorsService, UserService, modal) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/collaborate/video-collaborators.dir.html'),
      controller : function ($scope) {

        $scope.invite = {
          permissions : 'canComment'
        };

        $scope.select2Options = {
          width: '100%',
          multiple: true,
          minimumInputLength: 3,
          placeholder: 'Type the email address or name of someone to invite'
        };

        UserService.getConnections(true).then(function (data) {
          $scope.connections = data;
          $scope.select2Options.tags = data;
        });

        $scope.$watch(
          'video.id',
          function(newValue, oldValue) {
            if (! $scope.flags.isPublic && newValue && newValue !== oldValue) {
              CollaboratorsService.getCollaborators(newValue).success(function (data) {
                $scope.collaborators = data.collaborator.items;
              });
            }
          }
        );

        $scope.notify = function () {
          $scope.flags.notified = true;

          CommentsService.notify($scope.video.id).then(function () {
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

})();