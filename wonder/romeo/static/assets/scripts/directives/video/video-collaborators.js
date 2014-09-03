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

        $scope.select2Options = {
            'multiple': true
        };

        UserService.getConnections().success(function (data) {
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