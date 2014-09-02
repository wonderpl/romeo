(function () {
    'use strict';

    function SecurityService($location, $q, $http, $timeout, localStorageService) {
        var debug = new DebugClass('SecurityService'),
            currentUser = null,
            currentAccount = null,
            loginAttempts = 0,
            originalUrl = null,
            checkingLogin = { request: null, response: new $q.defer() },
            externalCredentials = null;

        function _saveAccountAndUserDetails(res) {
            var data = res.data || res;
            if (data.auth_status && data.auth_status !== "logged_in") {
                debug.error('_saveAccountAndUserDetails with wrong auth_status', data.auth_status);
                _resetAccountAndUserDetails();
            }
            else {
                debug.info('_saveAccountAndUserDetails', data);
                currentUser = data.user;
                currentAccount = data.account;
            }
        }

        function _resetAccountAndUserDetails() {
            currentUser = null;
            currentAccount = null;
        }

        function _loginCheck() {
            if (checkingLogin.request === null) {
                debug.log('LoginCheck: - Hit API see if we are logged in');
                checkingLogin.request = $http({method: 'GET', url: '/api' });

                checkingLogin.request.then(function (res) {
                    if (res.data.auth_status === "logged_in") {
                        debug.info("LoginCheck: Logged in");
                        _saveAccountAndUserDetails(res);
                        checkingLogin.response.resolve(res);
                    }
                    else {
                        debug.info("LoginCheck: Logged out");
                        _resetAccountAndUserDetails();
                        checkingLogin.response.reject(res);
                    }
                }, function (res){
                    _resetAccountAndUserDetails();
                    checkingLogin.response.reject('request failed');
                    debug.info("LoginCheck: Not logged in");
                });
            } else {
                debug.info('LoginCheck: Found request, return it');
            }
            checkingLogin.response.promise.then(function () {
                checkingLogin.request = null;
            }, function () {
                checkingLogin.request = null;
            });

            return checkingLogin.response.promise;
        }

        var service = {
            restoreUrl: function (url) {
                debug.info('restore url');
                $location.path('/profile'); // originalUrl || url || '/organise');
                originalUrl = null;
            },
            redirect: function (url) {
                originalUrl = $location.url();
                $location.path(url || '/login');
            },
            requireOnlyFromRoute: function () {
                debug.info('service require requireOnlyFromRoute');
                if (! service.isAuthenticated() ) {
                    _loginCheck();
                } else {
                    $timeout(function () {
                        checkingLogin.response.resolve(currentUser);
                    }, 1);
                }
                return checkingLogin.response.promise;
            },
            requireAuthenticated: function () {
                debug.info('service require authenticated', service.isAuthenticated());

                if (! service.isAuthenticated() ) {
                    _loginCheck();
                }
                else {
                    if (checkingLogin.request === null) {
                        checkingLogin.response = new $q.defer();
                        checkingLogin.response.resolve(currentUser);
                    }
                }
                return checkingLogin.response.promise;
            },
            requireCollaborator: function () {
                var deferred = new $q.defer();
                service.requireAuthenticated();
                if (checkingLogin.request) {
                    checkingLogin.response.promise.then(function (res) {
                        if (service.isCollaborator()) {
                            deferred.resolve();
                        }
                        else {
                            deferred.reject();
                        }
                    });
                }
                else {
                    if (service.isCollaborator()) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                    }
                }
                return deferred.promise;
            },
            requireCreator: function () {
                var deferred = new $q.defer();
                var msg = 'You need to pay for that';
                service.requireAuthenticated();
                if (checkingLogin.request) {
                    checkingLogin.response.promise.then(function (res) {
                        if (service.isAuthenticated()) {
                            deferred.resolve();
                            if (!service.isCreator()) {
                                // @TODO: If the user isn't a creator but a valid user show modal
                                alert(msg);
                            }
                        }
                        else {
                            deferred.reject();
                        }
                    });
                }
                else {
                    if (service.isAuthenticated()) {
                        deferred.resolve();
                        if (!service.isCreator()) {
                            // @TODO: If the user isn't a creator but a valid user show modal
                            alert(msg);
                        }
                    }
                    else {
                        deferred.reject();
                    }
                }
                return deferred.promise;
            },
            // Is the current user authenticated?
            isAuthenticated: function () {
              return (currentUser !== null);
            },
            // Is the current user an collaborator or better?
            // All logged in users are at least collaborators
            isCollaborator: function () {
              // @TODO: This is should be for account_type collaborator; not !content_owner
              return (service.isAuthenticated() && !angular.equals(currentAccount.account_type, 'content_owner'));
            },
            // Is the current user an creator?
            isCreator: function () {
              return (service.isAuthenticated() && angular.equals(currentAccount.account_type, 'content_owner'));
            },
            logout: function (redirectTo) {
              $http.get('/logout').then(function () {
                _resetAccountAndUserDetails();
                $location.path(redirectTo || '/login');
              });
            },
            login: function (username, password) {
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
            isProfileComplete: function () {
              return !!(currentUser && currentUser.user_name);
            },
            ExternalLogin: function (profile) {
                if (! externalCredentials) {
                    var dfd = new $q.defer();
                    debug.error('ExternalLogin was called before external credentials were set');
                    return new dfd.reject('Set credentials before calling external login');
                }
                var data = externalCredentials;
                var request;
                if (angular.isString(profile)){
                    data.username = profile;
                }
                else if (angular.isObject(profile)) {
                    angular.extend(data, profile);
                }

                debug.dir(data);
                request = $http.post('/api/login/external', data);
                request.then(function (response) {
                    debug.info('Logged in from external service');
                    debug.dir(response.data);
                    _saveAccountAndUserDetails(response.data);
                    service.setExternalCredentials(null);
                });
                return request;
            },
            setExternalCredentials: function (credentials) {
                debug.info('setExternalCredentials ' + credentials);
                externalCredentials = credentials;
            },
            getExternalCredentials: function (credentials) {
                debug.info('setExternalCredentials ' + credentials);
                externalCredentials = credentials;
            },
            registration: function (data) {
                return $http({
                    method: 'post',
                    url: '/api/register',
                    data: data
                }).success(function (data) {
                    debug.info('Registration successful');
                    debug.dir(data);
                    _saveAccountAndUserDetails(data);
                }).error(function () {
                    // debugger;
                });
            }
        };

        return service;
    }

    var securityAuthorizationProvider = function () {
      return {
        requireAuthenticated: ['securityAuthorization', function (securityAuthorization) {
            return securityAuthorization.requireAuthenticated();
          }],
        requireCollaborator: ['securityAuthorization', function (securityAuthorization) {
            return securityAuthorization.requireCollaborator();
          }],
        requireCreator: ['securityAuthorization', function (securityAuthorization) {
            return securityAuthorization.requireCreator();
          }],

          $get: ['$location', 'SecurityService', function ($location, security) {
            var originalUrl = null;
            var service = {

              // Require that there is an authenticated user
              // (use this in a route resolve to prevent non-authenticated users from entering that route)
              requireAuthenticated: function () {
                return security.requireAuthenticated();
              },

              // Require that there is an authenticated user
              // (use this in a route resolve to prevent non-authenticated users from entering that route)
              requireCollaborator: function () {
                return security.requireCollaborator();
              },

              // Require that there is an creator logged in
              // (use this in a route resolve to prevent non-creators from entering that route)
              requireCreator: function () {
                return security.requireCreator();
              }

            };

            return service;
          }]
      };
    };

    angular.module('RomeoApp.security').factory('SecurityService', ['$location', '$q', '$http', '$timeout', 'localStorageService', SecurityService]);
    angular.module('RomeoApp.security').provider('securityAuthorization', securityAuthorizationProvider);
})();
