
angular
  .module('RomeoApp.directives')
  .directive('organiseNavigation', ['$templateCache', OrganiseNavigationDirective]);

function OrganiseNavigationDirective ($templateCache) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-navigation.html'),
    scope : {
      tags : '='
    },
    controller : function ($scope) {
      function showCreateCollection (isPublic) {
        $scope.$emit('show-create-collection', isPublic);
      }
      $scope.loadCollection = function (id) {
        $scope.$emit('show-collection', id);
      };
      $scope.createPrivateCollection = function () {
        showCreateCollection();
      };
      $scope.createPublicCollection = function () {
        showCreateCollection(true);
      };
      $scope.showAllVideos = function () {
        $scope.$emit('show-collection');
      };
    }
  };
}
