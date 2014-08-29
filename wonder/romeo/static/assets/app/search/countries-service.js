angular.module('RomeoApp.services')
  .factory('CountriesService', ['$http', function ($http) {

  'use strict';

  var Countries = {};

  Countries.getAll = function () {
    return $http.get('/api/countries/');
  };

  return Countries;

}]);