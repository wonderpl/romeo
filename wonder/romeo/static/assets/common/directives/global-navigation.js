(function () {
  'use strict';
  function globalNavigation($templateCache, UserService) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('directives/global-navigation.tmpl.html'),
      scope: {

      },
      controller: function ($scope) {
        function init() {
          setAccountData(UserService.getUser());
          $scope.pages = $scope.pages || [
            {title: 'Upload a Video', url: '#/video'},
            {title: '* Uploads in progress', url: '#/video'},
            {title: '* Stats', url: '#/organise'},
            {title: 'Manage', url: '#/organise'},
            {title: 'Search', url: '#/search'},
            {title: '* Settings', url: '#/profile'}
          ];
        }
        function setAccountData(data) {
          $scope.account = data;
          if (data && data.avatar) {
            $scope.profileStyle = { 'background-image' : 'url(' + data.avatar + ')' };
          } else {
            $scope.profileStyle = { 'background-image' : 'url(/static/assets/img/user-avatar.png)' };
          }
        }
        $scope.$watch(function () {
          return UserService.getUser();
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
  angular.module('RomeoApp.directives').directive('globalNavigation', ['$templateCache', 'UserService', globalNavigation]);
})();