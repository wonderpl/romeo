// home.js
(function () {
  'use strict';
  var debug = new DebugClass('RomeoApp.pages');

  function HomePageCtrl($scope, SecurityService, FeaturedService) {
    function init() {
      $scope.isAuthenticated = SecurityService.isAuthenticated();
      $scope.display_name = SecurityService.getUser() ? SecurityService.getUser().display_name : '';
      FeaturedService.get().then(function (res) {
        res = res.data || res;
        $scope.articles = res.article.total ? res.article.items : [];
        $scope.users = res.user.total ? res.user.items : [];
        console.log('Homepage articles: ', $scope.articles);
        console.log('Homepage users: ', $scope.users);
      });
    }

    init();
  }
  angular.module('RomeoApp.pages').controller('HomePageCtrl', ['$scope', 'SecurityService', 'FeaturedService', HomePageCtrl]);
})();
