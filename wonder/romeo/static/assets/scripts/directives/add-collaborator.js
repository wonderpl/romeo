(function () {

  'use strict';

  function addCollaboratorDirective ($templateCache, CollaboratorsService, UserService) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('add-collaborator.html'),
      scope : {
        video : '=',
        addCollaboratorShow : '='
      },
      controller : function ($scope) {

        $scope.connections = [];

        $scope.invite = {
          permissions : 'canDownload',
          collaborators : []
        };

        $scope.select2Options = {
          width: '100%',
          multiple: true,
          tags: function () {
            return $scope.connections;
          }
        };

        UserService.getConnections(true).then(function (data) {
          $scope.connections = data;
          $scope.select2Options.tags = data;
        });

        $scope.add = function () {

          console.log($scope.invite);

          CollaboratorsService.addCollaborators($scope.video.id, $scope.invite)
          .success(function () {
            $scope.collaboratorAdded = true;
            $scope.errors = null;
            $scope.$emit('notify', {
              status : 'success',
              title : 'Connections Invited',
              message : 'Your selected connections have been sent invitations to collaborate on this video.'}
            );
          })
          .error(function (data, status, headers, config) {
            $scope.collaboratorAdded = false;
            $scope.errors = data;
            $scope.$emit('notify', {
              status : 'error',
              title : 'Invitation Send Error',
              message : 'No invitations have been sent.'}
            );
          });
        };

      }
    };
  }

  angular.module('RomeoApp.directives').directive('addCollaborator', ['$templateCache', 'CollaboratorsService', 'UserService', addCollaboratorDirective]);

})();

