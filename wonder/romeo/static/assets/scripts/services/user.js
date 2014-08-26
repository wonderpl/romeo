(function () {
  angular.module('RomeoApp.services')
    .factory('UserService', ['DataService', function (DataService) {

    'use strict';

    var User = {};

    User.connect = function (id) {
      var url = '/api/user/' + id + '/connections';
      return DataService.request({ url: url, method: 'POST' });
    };

    return User;

  }]);
})();

