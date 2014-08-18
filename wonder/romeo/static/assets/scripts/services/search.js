angular.module('RomeoApp.services')
  .factory('SearchService', ['DataService', function (DataService) {

  'use strict';

  var Search = {};

  Search.search = function (expression) {

    var query = encodeURIComponent(JSON.stringify(expression));

    var url = '/api/search/?' + query;
    return DataService.request({
      url     : url,
      method  : 'GET'
    });
  };

  return Search;

}]);