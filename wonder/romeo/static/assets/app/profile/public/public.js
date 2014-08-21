
angular
  .module('RomeoApp.profile')
  .directive('profilePublic', ['$templateCache', 'AccountService',
function ($templateCache, AccountService) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile/public/public.tmpl.html'),
    scope : {
      flags: '='
    },
    controller : function ($scope) {
      $scope.videos = [
        {title: 'First video'},
        {title: 'Pumping Iron'},
        {title: 'Donald Ducks Xmas'}
      ];
      $scope.collaborators = [
        {display_name: "Walt Disney"},
        {display_name: "Steven Spielberg"},
        {display_name: "Arnie"}
      ];
      $scope.$watch('flags', function () {
        if (! angular.equals(newValue, oldValue)) {
          $scope.collaborators.push({display_name: newValue.accountId});

          // AccountService.getCollaborators(newValue.accountId).then()...
        }
      }, true);
    }
  };
}
]);
