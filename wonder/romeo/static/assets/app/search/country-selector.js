(function () {

  'use strict';

  angular.module('RomeoApp.directives')
  .directive('countrySelector', ['$templateCache', 'CountriesService',
    function ($templateCache, CountriesService) {

      function getCountryByCode (code, countries) {
        var country = null;
        var l = countries.length;
        while (l--) {
          if (countries[l].code === code) {
            country = countries[l];
            break;
          }
        }
        return country;
      }

      return {
        restrict : 'E',
        replace : true,
        template : $templateCache.get('search/country-selector.tmpl.html'),
        scope : {
          country : '='
        },
        controller : function ($scope) {

          CountriesService.getAll().then(function (data) {
            $scope.countries = data;
            $scope.country = $scope.country || $scope.countries[0];
          }, function () {

            $scope.countries = [
              { name : 'United Kingdom', code : 'GB' },
              { name : 'USA', code : 'US' },
              { name : 'Afghanistan', code : 'AF' }
            ];
            $scope.country = $scope.country || $scope.countries[0];
          });

          $scope.hideOptions = function () {
            $scope.showCountryList = false;
          };

          $scope.select = function (code) {
            $scope.country = getCountryByCode(code, $scope.countries);
          };
        }
      };
    }
  ]);

})();