
angular
  .module('RomeoApp.profile')
  .directive('profilePublic', ['$templateCache', 'AccountService',
function ($templateCache, AccountService) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile/public/public.tmpl.html'),
    scope : {
      flags: '='
    },
    controller : function ($scope) {
      $scope.videos = [
        {title: 'First video'},
        {title: 'Pumping Iron'},
        {title: 'Donald Ducks Xmas'}
      ];
      $scope.collaborators = [
        {display_name: "Walt Disney", avatar: "http://upload.wikimedia.org/wikipedia/en/d/d4/Mickey_Mouse.png"},
        {display_name: "Steven Spielberg", avatar: "http://i.telegraph.co.uk/multimedia/archive/00655/news-graphics-2008-_655878a.jpg"},
        {display_name: "Arnie", avatar: "http://resources1.news.com.au/images/2012/09/17/1226475/822425-arnie.jpg"}
      ];
      $scope.$watch('flags', function (newValue, oldValue) {
        if (! angular.equals(newValue, oldValue)) {
          $scope.collaborators.push({display_name: newValue.accountId});

          // AccountService.getCollaborators(newValue.accountId).then()...
        }
      }, true);
    }
  };
}
]);
