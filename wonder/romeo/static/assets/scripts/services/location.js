angular.module('RomeoApp.services')
  .factory('LocationService', ['$http', function ($http) {

  'use strict';

  var Countries = {};

  Countries.getAll = function () {
    return $http.get('/api/locations');
  };

  return Countries;

}]);