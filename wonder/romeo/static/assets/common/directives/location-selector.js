(function () {
	'use strict';

	function locationSelector($templateCache, AccountService) {
		console.error('Loaded location selector directive');
		return {
			restrict : 'E',
			replace : true,
			template : $templateCache.get('directives/location-selector.tmpl.html'),
			scope: {
				location: '='
			},
			controller: function ($scope) {
				console.error('Loaded location selector directive controller');
				if (! $scope.location) {
					var loc = AccountService.getGeoIpLocation();
					$scope.location = loc ? loc.country : 'UK';
				}
			}
		};
	}
	angular.module('RomeoApp.directives').directive('locationSelector', ['$templateCache', 'AccountService', locationSelector]);
})();