angular.module('RomeoApp.services')
  .factory('SearchService', ['$location', 'DataService', function ($location, DataService) {

  'use strict';

  var Search = {};

  Search.search = function (expression) {

    expression = expression || {};

    var query = typeof expression === 'string' ? expression : $.param(expression),
        queryPrefix = query.indexOf('src=') < 0 ? 'src=video&src=content_owner&src=collaborator&' : '';

    $location.search(query);

    var url = '/api/search?' + queryPrefix + query;
    return DataService.request({
      url     : url,
      method  : 'GET'
    });
  };

  return Search;

}]);
