(function () {
	'use strict';
	function locationSelector($templateCache, AccountService, LocationService) {
		return {
			restrict : 'E',
			replace : true,
			template : $templateCache.get('directives/location-selector.tmpl.html'),
      scope: {
        location: '='
      },
      controller: function ($scope) {
        LocationService.getAll().then(function (response) {
          $scope.locations = response.data.country.items;
        });
        $scope.select2Options = { };
      }
		};
	}
	angular.module('RomeoApp.directives').directive('locationSelector', ['$templateCache', 'AccountService', 'LocationService', locationSelector]);
})();