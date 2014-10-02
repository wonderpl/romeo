//featured-service.js
(function () {
  'use strict';

  function featuredService($http) {
    var service = {};

    service.get = function() {
      return $http.get('/api/featured');
    };

    return service;
  }
  angular.module('RomeoApp.pages')
    .factory('FeaturedService', ['$http', featuredService]);
})();