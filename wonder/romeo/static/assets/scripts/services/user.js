(function () {
  'use strict';
  angular.module('RomeoApp.services')
    .factory('UserService', ['DataService', '$q', '$http', function (DataService, $q, $http) {
    var User = {};

    User.connect = function (id) {
      var url = '/api/user/' + id + '/connections';
      return DataService.request({ url: url, method: 'POST' });
    };

    User.getConnections = function () {

      var dfd = new $q.defer();

      $http.get('/api').success(function (data) {

        var url = '/api/user/' + data.user.id + '/connections';

        DataService.request({ url: url }).then(dfd.resolve, dfd.reject);

      });

      return dfd.promise;

    };

    return User;

  }]);
})();

