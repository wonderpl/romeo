(function () {
  'use strict';
  function globalNavigation($templateCache, AuthService) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('directives/global-navigation.tmpl.html'),
      scope: {

      },
      controller: function ($scope) {
        function init() {
          setAccountData(AuthService.getUser());
          $scope.pages = $scope.pages || [
            {title: 'Search', url: '#/search'},
            {title: 'Manage', url: '#/organise'},
            {title: 'Upload', url: '#/video'}
          ];
          console.dir($scope);
        } 
        function setAccountData(data) {
          $scope.account = data;
          if (data && data.avatar) {
            $scope.profileStyle = { 'background-image' : 'url(' + data.avatar + ')' };
          }
        }
        $scope.$watch(function () {
          return AuthService.getUser();
        }, function (newValue, oldValue) {
          if (newValue !== oldValue)
            setAccountData(newValue);
        });
        init();
      },
      link: function($scope, $element, $attrs) {
        $element.on('click', function(event) {
          $('body').toggleClass('js-nav');
        });
      }
    };
  }
  angular.module('RomeoApp.directives').directive('globalNavigation', ['$templateCache', 'AuthService', globalNavigation]);
})();