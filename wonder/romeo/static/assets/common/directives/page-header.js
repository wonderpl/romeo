angular
  .module('RomeoApp.directives')
  .directive('pageHeader', ['$templateCache', '$timeout', '$location', 'SecurityService', 'UserService', 'UploadService', PageHeaderDirective]);

function PageHeaderDirective ($templateCache, $timeout, $location, SecurityService, UserService, UploadService) {
  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('directives/page-header.dir.html'),
    controller : function ($scope) {
      $scope.controller = 'RomeoApp.directives.pageHeader';
      $scope.search = { query: '' };
      $scope.isSearch = ($location.url().indexOf('/search') !== -1);
      $scope.$watch(function () {
        return $location.url();
      }, function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          $scope.isSearch = (newValue.indexOf('/search') !== -1);
          $scope.search.query = '';
        }
      });
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
      $scope.search = function () {
        $location.url('/search?q=' + $scope.search.query);
      };
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
