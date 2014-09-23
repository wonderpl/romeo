(function () {
	'use strict';
	function locationSelector($templateCache, LocationService) {
		return {
			restrict : 'E',
			replace : true,
			template : $templateCache.get('directives/location-selector.dir.html'),
      scope: {
        location: '=',
        allowEmpty: '='
      },
      controller: function ($scope) {
        LocationService.getAll().then(function (response) {
          $scope.locations = response.data.country.items;
        });
        $scope.select2Options = { };
      }
		};
	}
	angular.module('RomeoApp.directives').directive('locationSelector', ['$templateCache', 'LocationService', locationSelector]);
})();