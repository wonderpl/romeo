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
          setAvatar(newValue);
        }
      });
      $scope.isCollaborator = function () {
        return AuthService.isCollaborator();
      };
      $scope.isLoggedIn = function () {
        return AuthService.isLoggedIn();
      };
      function setAvatar(account) {
        var avatar = (account) ? account.avatar : null;
        $scope.profile = { 'background-image' : 'url(' + (avatar || '/static/assets/img/user-avatar.png') + ')' };
      }
      setAvatar(AuthService.getUser());
    }
  };
}
