/*
* Methods for interacting with the Account web services
*/
angular.module('RomeoApp.services').factory('AccountService',
    ['$http', '$q', 'DataService', 'localStorageService', 'AuthService', 'SecurityService',
    function ($http, $q, DataService, localStorageService, AuthService, SecurityService) {

    'use strict';
    var debug = new DebugClass('AccountService');

    var Account = {},
        User = null,
        ID = null;

    /*
    * Returns a promise, which if resolved returns the User object from the web service.
    */
    Account.getUser = function() {
        var deferred = new $q.defer();

        AuthService.loginCheck().then(function(response){
            AuthService.getSessionId().then(function (_id) {
                if ( ID === null )
                    debug.log('New User added to AccountService');
                else if (_id === ID)
                    debug.log('User already in AccountService');
                else
                    debug.log('User loaded into AccountService');

                ID = _id;
            });
            User = AuthService.getUser();
            deferred.resolve(User);
        });
        return deferred.promise;
    };

    /*
    * Used to send PATCH requests to the webservice, updating individual parts of the user account
    */
    Account.updateUser = function(data) {
        var url = '/api/account/' + ID;
        return DataService.request({url: url, method: 'PATCH', data: data });
    };

    /*
    * Send a PATCH request with an updated cover image
    */
    Account.updateCoverImage = function(data) {
        return DataService.uploadImage( ('/api/account/' + ID), 'profile_cover', data);
    };

    /*
    * Send a PATCH request with an updated avatar image
    */
    Account.updateAvatar = function(data) {
        return DataService.uploadImage( ('/api/account/' + ID), 'avatar', data);
    };

    Account.getGeoIpLocation = function () {
        return $http({method: 'JSONP', url: 'https://secure.wonderpl.com/ws/location/?_callback=JSON_CALLBACK'});
    };

    // New code using SecurityService

    Account.getAccount = function () {
        return SecurityService.getAccount();
    };

    Account.getAccountId = function () {
        return SecurityService.getAccount() ? SecurityService.getAccount().id : 0;
    };

    /*
    * Expose the methods to the service
    */
    return {
        getUser: Account.getUser,
        updateUser: Account.updateUser,
        updateCoverImage: Account.updateCoverImage,
        updateAvatar: Account.updateAvatar,
        getGeoIpLocation: Account.getGeoIpLocation,
        getAccount: Account.getAccount,
        getAccountId: Account.getAccountId
    };
}]);