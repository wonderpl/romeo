(function () {
	'use strict';

	function locationSelector($templateCache, AccountService) {
		return {
			restrict : 'E',
			replace : true,
			template : $templateCache.get('directives/location-selector.tmpl.html'),
            controller: function ($scope) {
                if (! $scope.profile.location) {
                    AccountService.getGeoIpLocation().then(function (res) {
                        $scope.profile.location = $scope.profile.location || res;
                    });
                }
            }
		};
	}
	angular.module('RomeoApp.directives').directive('locationSelector', ['$templateCache', 'AccountService', locationSelector]);
})();