(function () {
    'use strict';

    function UserService(SecurityService, DataService) {
        var service = {};

        service.getUser = function () {
            console.log('UserService getUser');
            return SecurityService.getUser();
        };
        service.connect = function (id) {
          var url = '/api/user/' + id + '/connections';
          return DataService.request({ url: url, method: 'POST' });
        };

        return service;
    }
    angular.module('RomeoApp.services').factory('UserService', ['SecurityService', 'DataService', UserService]);

})();