angular
  .module('RomeoApp.directives')
  .directive('pageHeader', ['$templateCache', 'AuthService', PageHeaderDirective]);

function PageHeaderDirective ($templateCache, AuthService) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('page-header.html'),
    controller : function ($scope) {
      $scope.$watch(function () {
        return AuthService.getUser();
      }, function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          $scope.profile = { 'background-image' : 'url(' + (newValue.avatar || '/static/assets/img/user-avatar.png') + ')' };
        }
      });
    }
  };
}
