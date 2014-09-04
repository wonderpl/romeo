

(function () {

  'use strict';

  function SearchService ($location, $http) {

    var Search = {};

    Search.search = function (expression) {

      expression = expression || {};

      var query = typeof expression === 'string' ? expression : $.param(expression),
          queryPrefix = query.indexOf('src=') < 0 ? 'src=video&src=content_owner&src=collaborator&' : '';

      $location.search(query);

      var url = '/api/search?' + queryPrefix + query;

      return $http.get(url);

    };

    return Search;

  }

  angular.module('RomeoApp.services').factory('SearchService', ['$location', '$http', SearchService]);

})();