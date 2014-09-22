(function () {

  'use strict';

  angular.module('RomeoApp.directives')
    .directive('videoCollaborators', ['$templateCache', '$timeout', 'CommentsService', 'CollaboratorsService', 'UserService', 'modal',
    function ($templateCache, $timeout, CommentsService, CollaboratorsService, UserService, modal) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/video-collaborators.dir.html'),
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
            if (! $scope.flags.isPublic && newValue && newValue !== oldValue) {
              CollaboratorsService.getCollaborators(newValue).success(function (data) {
                $scope.collaborators = data.collaborator.items;
              });
            }
          }
        );

        $scope.showCollaboratorsModal = function () {
          var elem = modal.load('manage-collaborators.tmpl.html', true, $scope, {});
          $timeout(function () {
            elem.find('.select2').select2('focus');
          }, 100);

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