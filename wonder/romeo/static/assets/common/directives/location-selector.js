(function () {
	'use strict';
	function locationSelector($templateCache, AccountService, LocationService) {
		return {
			restrict : 'E',
			replace : true,
			template : $templateCache.get('directives/location-selector.tmpl.html'),
      controller: function ($scope) {
        LocationService.getAll().then(function (response) {
          $scope.locations = response.data.country.items;
        });
      },
      link: function (scope, element, attrs) {
        var select2 = element.find('.js-select2').select2();
        select2.on('change', function (e){
          var query = { q : scope.q, location: e.val };
          scope.$emit('search', query);
        });
        AccountService.getGeoIpLocation().then(function (res) {
          scope.location = res.data || res;
          select2.select2('val', scope.location);
        });
      }
		};
	}
	angular.module('RomeoApp.directives').directive('locationSelector', ['$templateCache', 'AccountService', 'LocationService', locationSelector]);
})();