angular.module('RomeoApp.services')
  .factory('SearchService', ['$location', 'DataService', function ($location, DataService) {

  'use strict';

  var Search = {};

  Search.search = function (expression) {

    var query = typeof expression === 'string' ? expression : $.param(expression);

    $location.search(query);

    var url = '/api/search/?' + query;
    return DataService.request({
      url     : url,
      method  : 'GET'
    });
  };

  return Search;

}]);