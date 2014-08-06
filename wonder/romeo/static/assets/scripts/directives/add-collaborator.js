angular
  .module('RomeoApp.directives')
  .directive('addCollaborator', addCollaboratorDirective);

function addCollaboratorDirective ($templateCache, CollaboratorsService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('add-collaborator.html'),
    scope : {
      video : '=',
      showCollaborator : '='
    },
    controller : function ($scope) {

      var collaborator = {
        email : '',
        name : '',
        can_comment : false,
        can_download : false
      };

      $scope.collaborator = collaborator;

      $scope.add = function () {
        $scope.errors = null;
        $scope.collaboratorAdded = false;
        if ($scope.video && $scope.video.id) {
          CollaboratorsService.addCollaborator($scope.video.id, $scope.collaborator).then(
          function(data) {
            console.log(data);
            $scope.collaboratorAdded = true;
            $scope.collaborator = null;
            $scope.$emit('notify', {
              status : 'success',
              title : 'Collaborator Added',
              message : $scope.collaborator + ' has been added as a collaborator.'}
            );
          },
          function (response) {
            $scope.errors = response.data.error;
            console.log(response);
            console.log(response.data);
            console.log(response.data.form_errors);
          });
        } else {
          $scope.errors = {};
        }

      };

    }
  };
}