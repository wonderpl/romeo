angular.module('RomeoApp.directives')
  .directive('addCollaborator', ['$templateCache', 'CollaboratorsService', function ($templateCache, CollaboratorsService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('add-collaborator.html'),
    scope : {
      videoId : '@'
    },
    controller : function ($scope) {

      $scope.collaborator = {
        email : '',
        name : '',
        can_comment : false,
        can_download : false
      };

      $scope.add = function () {

        CollaboratorsService.addCollaborator($scope.videoId, $scope.collaborator).then(function() {},
        function (response) {
          console.log(response);
          console.log(response.error);
          console.log(response.form_errors);
        });
      };

    }
  };
}]);