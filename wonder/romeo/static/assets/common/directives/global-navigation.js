(function () {
  'use strict';
  function globalNavigation($templateCache, UserService, SecurityService) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('directives/global-navigation.tmpl.html'),
      scope: {

      },
      controller: function ($scope) {
        function init() {
          var fullPageList = [
            {title: 'Upload a Video', url: '#/video', requireCreator: true},
            {title: '* Uploads in progress', url: '#/video', requireCreator: true},
            {title: '* Stats', url: '#/organise', requireCreator: true},
            {title: 'Manage', url: '#/organise'},
            {title: 'Search', url: '#/search'},
            {title: '* Settings', url: '#/profile'}
          ];
          setAccountData(UserService.getUser());
          if (SecurityService.isCollaborator()) {
            var smallerList = [];
            for(var i = 0; i < fullPageList.length; ++i) {
              if (! fullPageList[i].requireCreator)
                smallerList[smallerList.length] = fullPageList[i];
            }
            fullPageList = smallerList;
          }
          $scope.pages = $scope.pages || fullPageList;

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
  angular.module('RomeoApp.directives').directive('globalNavigation', ['$templateCache', 'UserService', 'SecurityService', globalNavigation]);
})();