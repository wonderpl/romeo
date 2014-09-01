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
          if (!$scope.profile || !$scope.profile.location) {
            AccountService.getGeoIpLocation().then(function (res) {
            $scope.profile = $scope.profile || {};
              $scope.profile.location = $scope.profile.location || res;
              $('.js-select2').select2('val', $scope.profile.location);
              $scope.location = $scope.profile.location;
              $('.js-select2').on('change', function (e){
                console.log(e.val);
                $scope.$emit('search', {
                  q: $scope.q,
                  location: e.val
                });
              });
            });
          }
        });
      },
      link: function (scope, element, attrs) {
        element.find('.js-select2').select2();
      }
		};
	}
	angular.module('RomeoApp.directives').directive('locationSelector', ['$templateCache', 'AccountService', 'LocationService', locationSelector]);
})();