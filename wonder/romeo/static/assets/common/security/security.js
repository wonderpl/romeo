(function () {
    'use strict';

    function SecurityService($location, $q, $http, localStorageService) {
        var debug = new DebugClass('SecurityService');
        var currentUser = null;
        var currentAccount = null;
        var loginAttempts = 0;
        var originalUrl = null;
        var checkingLogin = null;

        function redirect(url) {
            originalUrl = $location.url();
            $location.path(url || '/login');
        }

        function getSession() {
            var deferred = new $q.defer();
            if ( localStorageService.get('session_url') !== null ) {
                debug.log('GetSession: - Local storage session found');
                deferred.resolve(localStorageService.get('session_url'));
            } else {
                debug.warn('GetSession: - No session');
                deferred.reject('no session');
            }

            return deferred.promise;
        }

        function _saveAccountAndUserDetails(res) {
            var data = res.data || res;
            currentUser = data.user;
            currentAccount = data.account;
        }

        function _resetAccountAndUserDetails() {
            currentUser = null;
            currentAccount = null;
        }

        function _loginCheck() {
            if (checkingLogin === null) {
                debug.log('LoginCheck: start request running');
                checkingLogin = new $q.defer();
                var promise = checkingLogin.promise;

                debug.log('LoginCheck: - Try to log in');
                getSession().then(function (res){
                    debug.log('LoginCheck: - Got session, trying to retrive profile url ' + (res.href || res));
                    $http({method: 'GET', url: (res.href || res) }).then(function(res2) {
                        currentUser = angular.fromJson(res2.data);
                        debug.log('LoginCheck: All good, access granted');
                        checkingLogin.resolve(currentUser);
                    }, function (res){
                        _resetAccountAndUserDetails();
                        debug.info("LoginCheck: Couldn't load profile with supplied session, not logged in");
                        checkingLogin.reject('not logged in');
                    });
                }, function (){
                    debug.info("LoginCheck: No session available, not logged in");
                    checkingLogin.reject('not logged in');
                });


                promise.then(function () {
                    checkingLogin = null;
                }, function () {
                    checkingLogin = null;
                    debug.info('LoginCheck: Request failed');
                });
            } else {
                debug.info('LoginCheck: found request, return it');
            }

            return checkingLogin.promise;
        }

        var service = {
            restoreUrl: function(url) {
                $location.path(originalUrl || url || '/organise');
                originalUrl = null;
            },
            requireCollaborator: function () {
                console.error('service require collaborator');
                if (! service.isCollaborator() ) {
                    _loginCheck().then(function (res) {
                        // _saveAccountAndUserDetails(res);
                    }, function () {
                        redirect();
                    });
                }
                return currentUser;
            },
            requireCreator: function () {
                requireCollaborator();
                // We now know this is either a logged in user or we have been sent to login
                if (service.isCollaborator() && !service.isCreator()) {
                    // If the user isn't a creator but a valid user show modal
                    alert('You need to pay for that');
                }

                return currentUser;
            },
            // Is the current user authenticated?
            isAuthenticated: function(){
              return !!currentUser;
            },
            // Is the current user an collaborator or better?
            // All logged in users are at least collaborators
            isCollaborator: function() {
              return service.isAuthenticated();
            },
            // Is the current user an creator?
            isCreator: function() {
              return !!(service.isAuthenticated() && angular.equals(currentUser.account_type, 'content_owner'));
            },
            logout: function(redirectTo) {
              $http.post('/api/logout').then(function() {
                _resetAccountAndUserDetails();
                $location.path(redirectTo || '/login');
              });
            },
            login: function(username, password) {
                var deferred = new $q.defer();
                if (loginAttempts >= 3) {
                    deferred.reject({ data: { error: 'Too many login attempts' } });
                    return deferred.promise;
                }

                return $http({
                    method: 'post',
                    url: '/api/login',
                    data: {
                        'username': username,
                        'password': password
                    }
                }).success(function (data) {
                    _saveAccountAndUserDetails(data);
                    loginAttempts = 0;
                    localStorageService.add('session_url', currentUser.href);
                }).error(function () {
                    ++loginAttempts;
                });
            },
            getUser: function () {
                return currentUser;
            },
            getAccount: function () {
                return currentAccount;
            },
            // Is the current users registration complete (for twitter users)?
            isProfileComplete: function(){
              return !!(currentUser && currentUser.user_name);
            }
        };

        return service;
    }

    var securityAuthorizationProvider = function() {
      return {
        requireCollaborator: ['securityAuthorization', function(securityAuthorization) {
            return securityAuthorization.requireCollaborator();
          }],
        requireCreator: ['securityAuthorization', function(securityAuthorization) {
            return securityAuthorization.requireCreator();
          }],

          $get: ['$location', 'SecurityService', function($location, security) {
            var originalUrl = null;
            var service = {

              // Require that there is an authenticated user
              // (use this in a route resolve to prevent non-authenticated users from entering that route)
              requireCollaborator: function() {
                return security.requireCollaborator();
              },

              // Require that there is an creator logged in
              // (use this in a route resolve to prevent non-creators from entering that route)
              requireCreator: function() {
                return security.requireCreator();
              }

            };

            return service;
          }]
      };
    };

    angular.module('RomeoApp.security').factory('SecurityService', ['$location', '$q', '$http', 'localStorageService', SecurityService]);
    angular.module('RomeoApp.security').provider('securityAuthorization', securityAuthorizationProvider);
})();
