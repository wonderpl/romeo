(function () {
	'use strict';

	function locationSelector($templateCache, AccountService) {
		return {
			restrict : 'E',
			replace : true,
			template : $templateCache.get('directives/location-selector.tmpl.html')
		};
	}
	angular.module('RomeoApp.directives').directive('locationSelector', ['$templateCache', 'AccountService', locationSelector]);
})();