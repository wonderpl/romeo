angular.module('RomeoApp.profile')

.directive('profileViewDetails', ['$templateCache',
	function($templateCache) {
    'use strict';
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('profile/directives/view-details.tmpl.html'),
      scope : {
        flags : '=',
        profile: '='
      },
      link: function($scope, $element, $attr) {
        $element.on('mouseenter', '.profile-collaborators li', function(event) {
          $(this).find('span').show();
        });
        $element.on('mouseleave', '.profile-collaborators li', function(event) {
          $(this).find('span').hide();
        });
      },
      controller: function ($scope) {
        $scope.collaborators = [
          {display_name: "Walt Disney", avatar: "http://upload.wikimedia.org/wikipedia/en/d/d4/Mickey_Mouse.png"},
          {display_name: "Steven Spielberg", avatar: "http://i.telegraph.co.uk/multimedia/archive/00655/news-graphics-2008-_655878a.jpg"},
          {display_name: "Arnie", accountId: '123456', avatar: "http://resources1.news.com.au/images/2012/09/17/1226475/822425-arnie.jpg"}
        ];
      }
    };
	}
]);