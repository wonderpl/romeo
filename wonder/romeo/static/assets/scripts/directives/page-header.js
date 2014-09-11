angular
  .module('RomeoApp.directives')
  .directive('pageHeader', ['$templateCache', '$timeout', 'SecurityService', 'UserService', 'UploadService', PageHeaderDirective]);

function PageHeaderDirective ($templateCache, $timeout, SecurityService, UserService, UploadService) {
  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('page-header.html'),
    controller : function ($scope) {
      $scope.controller = 'RomeoApp.directives.pageHeader';
      $scope.$watch(function () {
        return UserService.getUser();
      }, function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          setAccountValues(newValue);
        }
      }, true);
      $scope.isContentOwner = function () {
        return SecurityService.isContentOwner();
      };
      $scope.isLoggedIn = function () {
        return SecurityService.isAuthenticated();
      };
      $scope.isUploading = function () {
        return UploadService.isUploadingOrProcessing();
      };
      function setAccountValues(account) {
        var avatar = (account) ? account.avatar : null;
        $scope.profileStyle = { 'background-image' : 'url(' + (avatar || '/static/assets/img/user-avatar.png') + ')' };
        $scope.display_name = account ? account.name : '';
      }
      setAccountValues(UserService.getUser());
    },
    link: function ($scope, $element, $attrs) {
      var hasBeenCalled = false;
      $element.on('click', '.page-logo--header', function(event) {
        if (! $scope.isLoggedIn())
          return;
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
