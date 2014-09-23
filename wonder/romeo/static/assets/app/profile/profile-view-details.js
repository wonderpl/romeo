angular.module('RomeoApp.profile')

.directive('profileViewDetails', ['$templateCache',
	function($templateCache) {
    'use strict';
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('profile/profile-view-details.dir.html'),
      scope : true
    };
	}
]);