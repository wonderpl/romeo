(function () {
	'use strict';

	function locationSelector($templateCache, AccountService, CountriesService) {
		return {
			restrict : 'E',
			replace : true,
			template : $templateCache.get('directives/location-selector.tmpl.html'),
      controller: function ($scope) {
        CountriesService.getAll().then(function (response) {
          $scope.locations = response.data.country.items;
          if (! $scope.profile.location) {
            AccountService.getGeoIpLocation().then(function (res) {
              $scope.profile.location = $scope.profile.location || res;
              $('.js-select2').select2('val', $scope.profile.location);
            });
          }
        });
      },
      link: function (scope, element, attrs) {
        element.find('.js-select2').select2();
      }
		};
	}
	angular.module('RomeoApp.directives').directive('locationSelector', ['$templateCache', 'AccountService', 'CountriesService', locationSelector]);
})();