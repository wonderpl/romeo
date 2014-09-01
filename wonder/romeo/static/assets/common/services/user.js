(function () {
    'use strict';

    function UserService(SecurityService, DataService) {
        var service = {};

        // Used to send PATCH requests to the webservice, updating individual parts of the user account
        service.updateUser = function(data) {
            var url = '/api/user/' + SecurityService.getUser().id;
            return DataService.request({url: url, method: 'PATCH', data: data });
        };

        // Send a PATCH request with an updated avatar image
        service.updateAvatar = function(data) {
            return DataService.uploadImage( ('/api/user/' + SecurityService.getUser().id), 'avatar', data);
        };

        // Send a PATCH request with an updated cover image
        service.updateCoverImage = function(data) {
            return DataService.uploadImage( ('/api/user/' + SecurityService.getUser().id), 'profile_cover', data);
        };

        service.getUser = function () {
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