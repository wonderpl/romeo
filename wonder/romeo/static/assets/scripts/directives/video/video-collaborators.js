(function () {

  'use strict';

  angular.module('RomeoApp.directives')
    .directive('videoCollaborators', ['$templateCache', 'CommentsService', 'CollaboratorsService', 'UserService', 'modal',
    function ($templateCache, CommentsService, CollaboratorsService, UserService, modal) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video-collaborators.html'),
      controller : function ($scope) {

        $scope.invite = {
          permissions : 'canDownload'
        };

        $scope.select2Options = {
          width: '100%',
          multiple: true
        };

        $scope.sendInvitations = function () {
          CollaboratorsService.addCollaborators($scope.video.id, $scope.invite)
          .success(function () {
            modal.hide();
            $scope.$emit('notify', {
              status : 'success',
              title : 'Connections Invited',
              message : 'Your selected connections have been sent invitations to collaborate on this video.'}
            );
          })
          .error(function () {
            $scope.$emit('notify', {
              status : 'error',
              title : 'Invitation Send Error',
              message : 'No invitations have been sent.'}
            );
          });
        };

        UserService.getConnections(true).then(function (data) {
          $scope.connections = data;
          $scope.select2Options.tags = data;
        });

        $scope.$watch(
          'video.id',
          function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
              CollaboratorsService.getCollaborators(newValue).success(function (data) {
                $scope.collaborators = data.collaborator.items;
              });
            }
          }
        );

        $scope.showCollaboratorsModal = function () {
          modal.load('manage-collaborators.tmpl.html', true, $scope, {});
        };

        $scope.close = function () {
          modal.hide();
        };

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