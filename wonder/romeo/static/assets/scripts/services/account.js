/*
* Methods for interacting with the Account web services
*/
angular.module('RomeoApp.services').factory('AccountService',
    ['DataService', 'localStorageService', 'AuthService', '$q',
    function (DataService, localStorageService, AuthService, $q) {

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

    //
    Account.getAccountByExternalToken = function (service, token) {
        return $http.get('/api/account/external/' + service + '/' + token);
    };

    /*
    * Expose the methods to the service
    */
    return {
        getUser: Account.getUser,
        updateUser: Account.updateUser,
        updateCoverImage: Account.updateCoverImage,
        updateAvatar: Account.updateAvatar
    };
}]);