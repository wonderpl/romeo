
angular
  .module('RomeoApp.organise')
  .directive('organiseNavigation', ['$templateCache', 'SecurityService', OrganiseNavigationDirective]);

function OrganiseNavigationDirective ($templateCache, SecurityService) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise/organise-navigation.tmpl.html'),
    scope : {
      tags : '=',
      currentTag : '=',
      filterByRecent : '=',
      filterByCollaboration : '='
    },
    controller : function ($scope) {
      $scope.loadCollection = function (id) {
        $scope.$emit('show-collection', id);
      };
      $scope.showAllVideos = function () {
        $scope.$emit('show-collection');
      };
      $scope.showRecentVideos = function () {
        $scope.$emit('show-recent');
      };
      $scope.showCollaborationVideos = function () {
        $scope.$emit('show-collaboration');
      };
      $scope.isCollaborator = function () {
        return SecurityService.isCollaborator();
      };
    }
  };
}
