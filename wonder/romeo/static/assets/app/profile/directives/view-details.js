angular.module('RomeoApp.profile.directives')

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
      }
    };
	}
]);