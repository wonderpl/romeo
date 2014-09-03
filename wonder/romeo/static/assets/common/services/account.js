/*
* Methods for interacting with the Account web services
*/
(function () {
    'use strict';
    function AccountService($http, $q, DataService, localStorageService, AuthService, SecurityService) {
        var debug = new DebugClass('AccountService');

        var service = {},
            User = null;

        /*
        * Used to send PATCH requests to the webservice, updating individual parts of the user account
        */
        service.updateAccount = function(data) {
            var url = '/api/account/' + service.getAccountId();
            return $http({url: url, method: 'PATCH', data: data });
        };

        /*
        * Send a PATCH request with an updated cover image
        */
        service.updateCoverImage = function(data) {
            return DataService.uploadImage( ('/api/account/' + service.getAccountId()), 'profile_cover', data);
        };

        /*
        * Send a PATCH request with an updated avatar image
        */
        service.updateAvatar = function(data) {
            return DataService.uploadImage( ('/api/account/' + service.getAccountId()), 'avatar', data);
        };

        service.getGeoIpLocation = function () {
            return $http({method: 'JSONP', url: 'https://secure.wonderpl.com/ws/location/?_callback=JSON_CALLBACK'});
        };

        // New code using SecurityService

        service.getAccount = function () {
            return SecurityService.getAccount();
        };

        service.getAccountId = function () {
            return SecurityService.getAccount() ? SecurityService.getAccount().id : 0;
        };

        service.getPublicAccount = function (account_id) {
            return $http.get('/api/account/' + account_id + '?public');
        };

        /*
        * Expose the methods to the service
        */
        return service;
    }

    angular.module('RomeoApp.services').factory('AccountService',
        ['$http', '$q', 'DataService', 'localStorageService', 'AuthService', 'SecurityService', AccountService]);
})();