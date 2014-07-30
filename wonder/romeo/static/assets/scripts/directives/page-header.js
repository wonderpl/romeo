angular
  .module('RomeoApp.directives')
  .directive('pageHeader', PageHeaderDirective);

function PageHeaderDirective ($templateCache, $rootScope) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('page-header.html'),
    controller : function ($scope) {
      $scope.$watch(function () {
        return $rootScope.User.avatar;
      }, function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          $scope.profile = {
            'background-image' : 'url(' + newValue + ')'
          };
        }
      });
    }
  };
}
