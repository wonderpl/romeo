/*
* Methods for interacting with the Account web services
*/
angular.module('RomeoApp.services').factory('AccountService',
    ['DataService', 'localStorageService', '$rootScope', 'AuthService', '$q', '$timeout',
    function (DataService, localStorageService, $rootScope, AuthService, $q, $timeout) {

    'use strict';

    var Account = {},
        User = null,
        ID = null;

    /*
    * Returns a promise, which if resolved returns the User object from the web service.
    */
    Account.getUser = function() {
        var deferred = new $q.defer();

        if ( ID === null ) {
            AuthService.getSessionId().then(function(response){
                ID = response;
                DataService.request({url: ('/api/account/' + ID)}).then(function(response){
                    User = response;
                    $rootScope.User = response;
                    // $rootScope.$broadcast('user updated', response);
                    deferred.resolve(response);
                });
            });
        } else {
            DataService.request({url: ('/api/account/' + ID)}).then(function(response){
                console.log('User added to rootscope');
                User = response;
                $rootScope.User = response;
                // $rootScope.$broadcast('user updated', response);
                deferred.resolve(response);
            });
        }
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

    /*
    * Expose the methods to the service
    */
    return {
        getUser: Account.getUser,
        updateUser: Account.updateUser,
        updateCoverImage: Account.updateCoverImage,
        updateAvatar: Account.updateAvatar,
        User: User
    };
}]);