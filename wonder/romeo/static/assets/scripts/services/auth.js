/*
* Methods for logging in and out, and for accessing credentials used by the other services
*/
angular.module('RomeoApp.services').factory('AuthService',
    ['$rootScope', '$http', 'localStorageService', 'ErrorService', '$timeout', '$q', '$interval', '$location',
    function ($rootScope, $http, localStorageService, ErrorService, $timeout, $q, $interval, $location) {

    'use strict';

    var Auth = {},
        session = null,
        loggedIn = false,
        isCollaborator = false;

    /*
    * POSTS the users login credentials to the server.  If successful, we add the session url to local storage.
    */
    Auth.login = function(username, password){
        return $http({
            method: 'post',
            url: '/api/login',
            data: {
                'username': username,
                'password': password
            }
        }).success(function (data) {
            $rootScope.User = data.account;
            return Auth.setSession(data.account);
        }).error(function () {
            // debugger;
        });
    };

    /*
    * Returns a BOOLEAN.  If there is no session url in local storage, we aren't letting them in.
    */
    Auth.isLoggedIn = function() {
        return loggedIn;
    };

    /*
    * Returns a PROMISE.  Checks if the user is logged in.
    * First we check if the user has a session url in local storage
    * Second we check if we get a valid response when we try and communicated
    */
    Auth.loginCheck = function() {
      var deferred = new $q.defer();
      $timeout(function(){
          if ( loggedIn === true || isCollaborator === true ) {
            deferred.resolve();
          } else {
            Auth.getSession().then(function(response){
              $http({method: 'GET', url: (response.href || response) }).then(function(response){
                loggedIn = true;
                $rootScope.isLoggedIn = true;
                deferred.resolve();
              }, function(response){
                $rootScope.isLoggedIn = false;
                loggedIn = false;
                deferred.reject('not logged in');
              });
            }, function(){
                deferred.reject('not logged in');
            });
          }
      });
      return deferred.promise;
    };

    Auth.collaboratorCheck = function () {
      var query = $location.search();
      var token = query ? query.token : null;
      var dfd = new $q.defer();
      if (token) {
        Auth.loginAsCollaborator(token).then(dfd.resolve, dfd.reject);
      } else {
        dfd.reject();
      }
      return dfd.promise;
    };

    /*
    * Adds the session url to local storage
    */
    Auth.setSession = function(sessionData) {
        var session = null;
        if (sessionData) {
          localStorageService.add('session_url', sessionData.href);
          session = sessionData.href;
        }
        return session;
    };

    /*
    * returns a BOOLEAN.  If there is no session url in local storage, we aren't letting them in.
    */
    Auth.getSession = function() {
        var deferred = new $q.defer();

        $timeout(function() {
            if ( session !== null ) {
                deferred.resolve(session.account || session);
            } else if ( localStorageService.get('session_url') !== null ) {
                deferred.resolve(localStorageService.get('session_url'));
            } else {
                deferred.reject('no session');
            }
        });

        return deferred.promise;
    };

    /*
    * Try to pick out the ID from the session url
    */
    Auth.getSessionId = function() {
        var deferred = new $q.defer();
        Auth.getSession().then(function(response){
            deferred.resolve(response.match(/api\/account\/(\d+)/)[1]);
        }, function(response){
            deferred.reject('not logged in');
        });
        return deferred.promise;
    };

    /*
    * Redirects the user to the login page
    */
    Auth.redirect = function() {
        $location.path('/login');
    };

    /*
    * Login collaborators for commenting on videos
    */
    Auth.loginAsCollaborator = function (token) {
      return $http({
        method  : 'post',
        url     : '/api/validate_token',
        data    : { token : token }
      }).success(function (data) {
        loggedIn = true;
        isCollaborator = true;
        $rootScope.isCollaborator = true;
        $rootScope.User = data;
        return Auth.setSession(data);
      }).error(function () {
        alert('token invalid');
        $rootScope.isCollaborator = false;
        isCollaborator = false;
      });
    };

    return {
        login: Auth.login,
        loginAsCollaborator: Auth.loginAsCollaborator,
        isLoggedIn: Auth.isLoggedIn,
        loginCheck: Auth.loginCheck,
        collaboratorCheck: Auth.collaboratorCheck,
        setSession: Auth.setSession,
        getSession: Auth.getSession,
        getSessionId: Auth.getSessionId,
        redirect: Auth.redirect
    };
}]);