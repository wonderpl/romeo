/*
* Methods for interacting with the Account web services
*/
angular.module('RomeoApp.services').factory('AccountService',
    ['$http', '$q', 'DataService', 'localStorageService', 'AuthService', 'SecurityService',
    function ($http, $q, DataService, localStorageService, AuthService, SecurityService) {

    'use strict';
    var debug = new DebugClass('AccountService');

    var Account = {},
        User = null;

    /*
    * Used to send PATCH requests to the webservice, updating individual parts of the user account
    */
    Account.updateAccount = function(data) {
        var url = '/api/account/' + Account.getAccountId();
        return DataService.request({url: url, method: 'PATCH', data: data });
    };

    /*
    * Send a PATCH request with an updated cover image
    */
    Account.updateCoverImage = function(data) {
        return DataService.uploadImage( ('/api/account/' + Account.getAccountId()), 'profile_cover', data);
    };

    /*
    * Send a PATCH request with an updated avatar image
    */
    Account.updateAvatar = function(data) {
        return DataService.uploadImage( ('/api/account/' + Account.getAccountId()), 'avatar', data);
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
        updateAccount: Account.updateAccount,
        updateCoverImage: Account.updateCoverImage,
        updateAvatar: Account.updateAvatar,
        getGeoIpLocation: Account.getGeoIpLocation,
        getAccount: Account.getAccount,
        getAccountId: Account.getAccountId
    };
}]);