(function () {
  'use strict';

  function VideoAddCollaboratorModal($templateCache, modal, UserService, CollaboratorsService) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('video/add-collaborator.modal.html'),
      scope : true,
      controller: function ($scope) {
        $scope.connections = [];
        $scope.invite = {
          permissions : 'canDownload',
          collaborators : []
        };

        $scope.select2Options = {
          width: '100%',
          simple_tags: true,
          multiple: true,
          data: function () {
            return { results: $scope.connections };
          },
          createSearchChoice: function (term) {
            return {id: term, text: term};
          },
          initSelection: function (element, callback) {
            var data = [];
            $(element.val().split(",")).each(function () {
              data.push({id: this, text: this});
            });
            callback(data);
          },
          formatResult: function (obj) {
            if (obj.avatar)
              return '<div class="media"><span class="media__img avatar avatar--small"><img src="' + obj.avatar + '" class="avatar__img"></span> ' + obj.text + '</div>';
            return obj.text;
          },
          formatSelection: function (obj) {
            var connection = findConnectionById(obj.id || obj);
            return connection.text || connection.id;
          }
        };

        UserService.getConnections(true).then(function (data) {
          $scope.connections = data;
        });

        $scope.add = function () {
          if (! $scope.invite.collaborators || !$scope.invite.collaborators.length) {

            $scope.$emit('notify', {
              status : 'error',
              title : 'Invitation Failed',
              message : 'No invitations selected to send'}
            );
            return;
          }
          var originalCollaborators = angular.copy($scope.invite.collaborators);
          for (var i = 0; i < $scope.invite.collaborators.length; ++i) {
            if (angular.isString($scope.invite.collaborators[i])) {
              var coll = findConnectionById($scope.invite.collaborators[i]);
              $scope.invite.collaborators[i] = coll.text ? coll : { text: $scope.invite.collaborators[i] };
            }
          }
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
          $scope.invite.collaborators = originalCollaborators;
        };

        function findConnectionById(id) {
          for (var i = 0; i < $scope.connections.length; ++i) {
            console.dir($scope.connections[i]);
            if ($scope.connections[i].id == id)
              return $scope.connections[i];
          }
          return { id: id };
        }
      }
    };
  }

  angular.module('RomeoApp.video').directive('videoAddCollaborator', ['$templateCache', 'modal', 'UserService', 'CollaboratorsService', VideoAddCollaboratorModal]);

})();