
(function() {

  'use strict';

  var debug = new DebugClass('RomeoApp.search');

  function SearchRouteProvider ($routeProvider, securityAuthorizationProvider) {
    $routeProvider.when('/search', {
      templateUrl: 'search/search.tmpl.html',
      resolve: securityAuthorizationProvider.requireAuthenticated,
      controller: 'SearchCtrl',
      reloadOnSearch: false
    });
  }

  angular.module('RomeoApp.search').config(['$routeProvider', 'securityAuthorizationProvider', SearchRouteProvider]);

  function SearchCtrl ($scope, $location, $timeout, SearchService, AccountService) {

    var data = $location.search();

    if (!$.isEmptyObject(data)) {
      if (data.q) {
        search(data.q, data.location);
      }
      $scope.q = data.q;
      $scope.location = data.location;
    }
    else {
      AccountService.getGeoIpLocation().then(function (res) {
        $scope.userLocation = res.data || res;
        $scope.location = $scope.userLocation;
      });
    }

    function clearSearch () {
      $scope.results = null;
      $scope.q = null;
      $location.url($location.path());
    }

    function search (query, location) {
      var expression = {};
      expression.q = query;
      if (location) {
        expression.location = location;
      }
      return SearchService.search(expression).then(function (xhr) {
        console.log(xhr.data);
        $scope.results = xhr.data;
      });
    }

    var timeout;

    function processSearch (newValues, oldValues) {

      var query = {
        location : $scope.location
      };

      var searchDelay = 700;

      var hasNewLocation = newValues[1] !== oldValues[1];
      var queryIsValid = $scope.q && $scope.q.length > 1 && $scope.q.trim() !== '';
      if (hasNewLocation && queryIsValid) {
        query.location = newValues[1];
        query.q = $scope.q;
      }

      var hasNewQuery = newValues[0] && newValues[0] != oldValues[0] && newValues[0].length > 1;
      if (hasNewQuery) {
        query.q = newValues[0];
      }

      var hasSearchQuery = newValues[0] && newValues[0].trim() !== '';
      if (!hasSearchQuery) {
        clearSearch();
      }

      if (query.q || (query.location && query.q)) {
        $timeout.cancel(timeout);
        timeout = $timeout(function () {
          search(query.q, query.location);
        }, searchDelay);
      }
    }

    $scope.$watchCollection('[q, location]', processSearch);
  }

  angular.module('RomeoApp.search').controller('SearchCtrl', ['$scope', '$location', '$timeout', 'SearchService', 'AccountService', SearchCtrl]);

})();


