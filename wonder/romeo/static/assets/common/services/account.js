//
// Methods for interacting with the Account web services
//
(function () {
    'use strict';
    function AccountService($http, $q, DataService, localStorageService, SecurityService) {
        var debug = new DebugClass('AccountService');

        var service = {},
            User = null;

        // Used to send PATCH requests to the webservice, updating individual parts of the user account
        service.updateAccount = function(data) {
            var url = '/api/account/' + service.getAccountId();
            return $http({url: url, method: 'PATCH', data: data });
        };


        // Send a PATCH request with an updated cover image
        service.updateCoverImage = function(data) {
            return DataService.uploadImage( ('/api/account/' + service.getAccountId()), 'profile_cover', data);
        };


        // Send a PATCH request with an updated avatar image
        service.updateAvatar = function(data) {
            return DataService.uploadImage( ('/api/account/' + service.getAccountId()), 'avatar', data);
        };

        service.getGeoIpLocation = function () {
            return $http({method: 'JSONP', url: 'https://secure.wonderpl.com/ws/location/?_callback=JSON_CALLBACK'});
        };

        // Payment upgrade to content_owner
        // Takes a json object as argument of type: {"stripeToken": "xxx"}
        service.upgradeToContentOwner = function (data) {
            var queue = $http.post('/api/account/' + service.getAccountId() + '/payment', data);
            queue.then(function () {
                var account = service.getAccount();
                account.account_type = 'content_owner';
            });
            return queue;
        };

        // New code using SecurityService
        //
        service.getAccount = function () {
            console.log('AccountService.getAccount: ', SecurityService.getAccount());
            return SecurityService.getAccount();
        };

        service.getAccountId = function () {
            console.log('AccountService.getAccountId: ', SecurityService.getAccount(), SecurityService.getUser());
            return SecurityService.getAccount() ? SecurityService.getAccount().id : 0;
        };

        service.getPublicAccount = function (account_id) {
            return $http.get('/api/account/' + account_id + '?public');
        };

        // Expose the methods to the service
        return service;
    }

    angular.module('RomeoApp.services').factory('AccountService',
        ['$http', '$q', 'DataService', 'localStorageService', 'SecurityService', AccountService]);
})();