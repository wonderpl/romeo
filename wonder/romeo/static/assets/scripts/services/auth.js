/*
* Methods for logging in and out, and for accessing credentials used by the other services
*/
angular.module('RomeoApp.services').factory('AuthService',
    ['$http', 'localStorageService', 'ErrorService', '$q', '$interval', '$location',
    function ($http, localStorageService, ErrorService, $q, $interval, $location) {

    'use strict';

    var Auth = {},
        session = null,
        user = null,
        loggedIn = false,
        collaborator = false,
        debug = new DebugClass('auth'),
        checkingLogin = false,
        externalCredentials;

    function _saveUserDetails(account) {
        if (angular.isDefined(account)) {
            user = account;
            Auth.setSession(user);
        }
    }

    function _loginCheck() {
      var deferred = new $q.defer();
      if ( Auth.isLoggedIn() ) {
        deferred.resolve(user);
        debug.log('LoginCheck: - Already logged in (loggedIn: ' + user + ', collaborator: ' + collaborator + ')');
      }
      else {
        debug.log('LoginCheck: - Try to log in');
        Auth.getSession().then(function(response){
          debug.log('LoginCheck: - Got session, trying to retrive profile url');
          debug.info('LoginCheck: url to load: ' + (response.href || response));
          $http({method: 'GET', url: (response.href || response) }).then(function(response) {
            _saveUserDetails(angular.fromJson(response.data));
            debug.log('LoginCheck: All good, access granted');
            deferred.resolve(user);
          }, function(response){
            user = null;
            debug.warn("LoginCheck: Couldn't load profile with supplied session, not logged in");
            deferred.reject('not logged in');
          });
        }, function(){
            debug.warn("LoginCheck: No session available, not logged in");
            deferred.reject('not logged in');
        });
      }
      return deferred.promise;
    }

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
            _saveUserDetails(data.account);
            return Auth.setSession(user);
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
    Auth.registration = function(data) {
        return $http({
            method: 'post',
            url: '/api/register',
            data: data
        }).success(function (data) {
            debug.info('Registration successful');
            debug.dir(data);
            _saveUserDetails(data.account);
            return Auth.setSession(data.account);
        }).error(function () {
            // debugger;
        });
    };


    /*
    * Returns a BOOLEAN.  If there is no session url in local storage, we aren't letting them in.
    */
    Auth.isLoggedIn = function() {
        return user !== null;
    };
    Auth.isCollaborator = function() {
        return collaborator;
    };
    Auth.setCollaborator = function(value) {
        collaborator = value;
    };

    /*
    * Returns a PROMISE.  Checks if the user is logged in.
    * First we check if the user has a session url in local storage
    * Second we check if we get a valid response when we try and communicated
    */
    Auth.loginCheck = function() {
        if (checkingLogin === false) {
            debug.warn('LoginCheck: no current request running');
            checkingLogin = _loginCheck();
            checkingLogin.then(function () {
                checkingLogin = false;
                debug.info('LoginCheck: finished request');
            });
        } else {
            debug.info('LoginCheck: found request, return it');
        }
        return checkingLogin;
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
        if ( session !== null ) {
            debug.log('GetSession: - session already loaded');
            deferred.resolve(session.account || session);
        } else if ( localStorageService.get('session_url') !== null ) {
            debug.log('GetSession: - Local storage session found');
            deferred.resolve(localStorageService.get('session_url'));
        } else {
            debug.warn('GetSession: - No session');
            deferred.reject('no session');
        }

        return deferred.promise;
    };

    /*
    * Try to pick out the ID from the session url
    */
    Auth.getSessionId = function() {
        var deferred = new $q.defer();
        Auth.getSession().then(function(response){
            debug.info("GetSessionId: Session found return id");
            deferred.resolve(response.match(/api\/account\/(\d+)/)[1]);
        }, function(response){
            debug.warn("GetSessionId: Session not found");
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
        user = angular.fromJSON(data);
        collaborator = true;
        return Auth.setSession(data);
      }).error(function () {
        debug.warn('Login: Auth.loginAsCollaborator - Token invalid');
        alert('token invalid');
        collaborator = false;
      });
    };

    Auth.ExternalLogin = function (username) {
        if (! externalCredentials) {
            var dfd = new $q.defer();
            debug.error('ExternalLogin was called before external credentials were set');
            return new dfd.reject('Set credentials before calling external login');
        }
        var data = externalCredentials;
        var request;
        data.username = username;
        debug.dir(data);
        request = $http.post('/api/login/external', data);
        request.then(function (response) {
            debug.info('Logged in from external service');
            debug.dir(response.data);
            _saveUserDetails(response.data.account);
            Auth.setExternalCredentials(null);
        });
        return request;
    };

    Auth.getUser = function () {
        return user;
    };

    Auth.setExternalCredentials = function (credentials) {
        debug.info('setExternalCredentials ' + credentials);
        externalCredentials = credentials;
    };

    return {
        login: Auth.login,
        registration: Auth.registration,
        loginAsCollaborator: Auth.loginAsCollaborator,
        isLoggedIn: Auth.isLoggedIn,
        isCollaborator: Auth.isCollaborator,
        setCollaborator: Auth.setCollaborator,
        loginCheck: Auth.loginCheck,
        collaboratorCheck: Auth.collaboratorCheck,
        setSession: Auth.setSession,
        getSession: Auth.getSession,
        getSessionId: Auth.getSessionId,
        redirect: Auth.redirect,
        getUser: Auth.getUser,
        ExternalLogin: Auth.ExternalLogin,
        setExternalCredentials: Auth.setExternalCredentials
    };
}]);