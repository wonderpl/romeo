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
        isCollaborator = false,
        debug = new DebugClass('auth');

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

    // POST /api/register HTTP/1.1
    // Content-Type: application/json
    //
    // {
    //  "username": "user@email.com",
    //  "password": "xxx",
    //  "name": "display name",
    //  "location": "GB"
    // }
    //
    // On success the response will be the same as a login response.
    Auth.register = function(user) {
        return true;
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

      debug.log('Login: loginCheck');
      $timeout(function(){
          if ( loggedIn === true || isCollaborator === true ) {
            deferred.resolve();
            debug.log('Login: Auth.loginCheck - Already logged in (loggedIn: ' + loggedIn + ', isCollaborator: ' + isCollaborator + ')');
          } else {
            debug.log('Login: Auth.loginCheck - Try to log in');
            Auth.getSession().then(function(response){
              debug.log('Login: Auth.loginCheck - Got session, trying to retrive original url to verify the session is valid');
              $http({method: 'GET', url: (response.href || response) }).then(function(response){
                loggedIn = true;
                $rootScope.isLoggedIn = true;
                debug.log('Login: Auth.loginCheck - All good, access granted');
                deferred.resolve();
              }, function(response){
                $rootScope.isLoggedIn = false;
                loggedIn = false;
                debug.warn("Login: Auth.loginCheck - Couldn't access page with supplied session, not logged in");
                deferred.reject('not logged in');
              });
            }, function(){
                debug.warn("Login: Auth.loginCheck - No session available, not logged in");
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
      debug.group('Login: Auth.collaboratorCheck - Checking token: ');
          debug.log('Login: Auth.collaboratorCheck - $location');
          debug.dir($location);
          debug.log('Login: Auth.collaboratorCheck - $location.search()');
          debug.dir($location.search());
        
          debug.log('Login: Auth.collaboratorCheck - token');
          debug.dir(token);
      debug.groupEnd();

      if (token) {
        debug.log('Login: Auth.collaboratorCheck - Have token (' + token + ') in url, check it');
        Auth.loginAsCollaborator(token).then(dfd.resolve, dfd.reject);
      } else {
        debug.warn('Login: Auth.collaboratorCheck - No token, nothing to do here');
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
        debug.log('Login: Auth.getSession');
        $timeout(function() {
            if ( session !== null ) {
                debug.log('Login: Auth.getSession - session cookie found');
                deferred.resolve(session.account || session);
            } else if ( localStorageService.get('session_url') !== null ) {
                debug.log('Login: Auth.getSession - Local storage session found');
                deferred.resolve(localStorageService.get('session_url'));
            } else {
                debug.warn('Login: Auth.getSession - No session');
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
            debug.info("Login: Auth.getSessionId - Session found, checking if it's a valid account");
            deferred.resolve(response.match(/api\/account\/(\d+)/)[1]);
        }, function(response){
            debug.warn("Login: Auth.getSession - Session not found");
            deferred.reject('not logged in');
        });
        return deferred.promise;
    };

    /*
    * Redirects the user to the login page
    */
    Auth.redirect = function() {
        debug.error('Login: Auth.redirect - Login method told to redirect to login page');
        debug.trace();
        $location.path('/login');
    };

    /*
    * Login collaborators for commenting on videos
    */
    Auth.loginAsCollaborator = function (token) {
      return $http({
        method  : 'post',
        url     : '/api/validate_token',
        data    : { 'token' : token }
      }).success(function (data) {
        debug.log('Login: Auth.loginAsCollaborator - Token validated');
        loggedIn = true;
        isCollaborator = true;
        $rootScope.isCollaborator = true;
        $rootScope.User = data;
        return Auth.setSession(data);
      }).error(function () {
        debug.warn('Login: Auth.loginAsCollaborator - Token invalid');
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