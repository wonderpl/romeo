angular
  .module('RomeoApp.directives')
  .directive('pageHeader', ['$templateCache', '$timeout', 'AuthService', 'UserService', PageHeaderDirective]);

function PageHeaderDirective ($templateCache, $timeout, AuthService, UserService) {
  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('page-header.html'),
    controller : function ($scope) {
      $scope.$watch(function () {
        return UserService.getUser();
      }, function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          setAccountValues(newValue);
        }
      });
      $scope.isCollaborator = function () {
        return AuthService.isCollaborator();
      };
      $scope.isLoggedIn = function () {
        return AuthService.isLoggedIn();
      };
      function setAccountValues(account) {
        var avatar = (account) ? account.avatar : null;
        $scope.profile = { 'background-image' : 'url(' + (avatar || '/static/assets/img/user-avatar.png') + ')' };
        $scope.display_name = account ? account.name : '';
      }
      setAccountValues(UserService.getUser());
    },
    link: function ($scope, $element, $attrs) {
      var hasBeenCalled = false;
      $element.on('click', '.page-logo--header', function(event) {
        event.stopPropagation();
        if (hasBeenCalled) {
          $('body').toggleClass('js-nav');
        }
        else {
          $('body').addClass('js-nav--3dtransitions');
          $timeout(function () {
            $('body').toggleClass('js-nav');
          }, 10);
          hasBeenCalled = true;
        }
        return false;
      });
    }
  };
}
