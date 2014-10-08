angular.module('RomeoApp.services')
  .factory('LocationService', ['$http', '$q', function ($http, $q) {

  'use strict';

  var service = {};
  var locations;

  service.getAll = function () {
    var queue;
    if (locations) {
        queue = new $q.defer();
        queue.resolve(locations);
        return queue.promise;
    }
    queue = $http.get('/api/locations');
    queue.then(function (res) {
        locations = res;
    });
    return queue;
  };

  return service;

}]);