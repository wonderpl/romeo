angular.module('RomeoApp.profile')

.directive('profileViewDetails', ['$templateCache',
	function($templateCache) {
    'use strict';
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('profile/view-details.tmpl.html'),
      scope : true
    };
	}
]);