(function () {

  'use strict';

  angular.module('RomeoApp.directives')
    .directive('videoCollaborators', ['$templateCache', 'CommentsService', 'CollaboratorsService', 'UserService', 'modal',
    function ($templateCache, CommentsService, CollaboratorsService, UserService, modal) {

      function getConnectionsWhoArentCollaborators (connections, collaborators) {
        var connectionsWhoArentCollaborators = [];
        var l = connections.length;
        while (l--) {
          var connection = connections[l];
          var k = collaborators.length;
          while (k--) {
            var collaborator = collaborators[k];
            if (!connection.collaborator || collaborator.id !== connection.collaborator.id) {
              connectionsWhoArentCollaborators.push(connection);
            }
          }
        }
        return connectionsWhoArentCollaborators;
      }

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video-collaborators.html'),
      scope : true,
      controller : function ($scope) {

        UserService.getConnections().then(function (data) {
          console.log('all connections');
          console.log(data);
          $scope.connections = data.connection.items;
        });

        $scope.$watch(
          'video.id',
          function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
              CollaboratorsService.getCollaborators(newValue).then(function (data) {
                console.log('video collaborators');
                console.log(data);
                $scope.collaborators = data.collaborator.items;
                $scope.connectionsWhoArentCollaborators = getConnectionsWhoArentCollaborators($scope.connections, $scope.collaborators);
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