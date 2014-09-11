(function () {
  'use strict';
  function globalNavigation($templateCache, UserService, SecurityService, UploadService) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('directives/global-navigation.tmpl.html'),
      scope: {

      },
      controller: function ($scope) {
        function init() {
          $scope.isUploading = false;

          if (SecurityService.isAuthenticated()) {
            setAccountData(UserService.getUser());
          }
          $scope.$watch(UploadService.isUploading, function (newValue, oldValue) {
            if (newValue !== oldValue)
              $scope.isUploading = newValue;
          });
          $scope.$watch(UserService.getUser, function (newValue, oldValue) {
            if (newValue !== oldValue)
              setAccountData(newValue);
          }, true);
          $scope.logout = function () {
            SecurityService.logout();
          };
        }
        function setAccountData(data) {
           var avatar = (data) ? data.avatar : null;
        $scope.profileStyle = { 'background-image' : 'url(' + (avatar || '/static/assets/img/user-avatar.png') + ')' };
        }
        init();
      },
      link: function($scope, $element, $attrs) {
        $element.on('click', function(event) {
          $('body').toggleClass('js-nav');
          $('body').trigger('focus');
        });
      }
    };
  }
  angular.module('RomeoApp.directives').directive('globalNavigation', ['$templateCache', 'UserService', 'SecurityService', 'UploadService', globalNavigation]);
})();