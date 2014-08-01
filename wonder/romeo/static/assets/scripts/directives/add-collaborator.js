angular.module('RomeoApp.directives')
  .directive('addCollaborator', ['$templateCache', 'CollaboratorsService', function ($templateCache, CollaboratorsService) {

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
        CollaboratorsService.addCollaborator($scope.video.id, $scope.collaborator).then(
        function(data) {
          console.log(data);
          $scope.collaboratorAdded = true;
          $scope.collaborator = null;
        },
        function (response) {
          $scope.errors = response.data.error;
          console.log(response);
          console.log(response.data);
          console.log(response.data.form_errors);
        });
      };

    }
  };
}]);