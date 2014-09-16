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
                $location.url(originalUrl || url || '/organise');
                originalUrl = null;
            },
            redirect: function (url) {
                // If the url wasn't login set the url to redirect back to after login
                if ($location.url() && $location.url().indexOf('/login') === -1 && $location.url().indexOf('/organise') === -1)
                    originalUrl = $location.url();
                $location.url(url || '/login');
            },
            loadAuthentication: function () {
                debug.info('service load authentication', service.isAuthenticated());

                if (! service.isAuthenticated() ) {
                    _loginCheck();
                }

                return true;
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
            requireContentOwner: function () {
                var deferred = new $q.defer();
                var msg = 'You need to pay for that';
                service.requireAuthenticated();
                if (checkingLogin.request) {
                    checkingLogin.response.promise.then(function (res) {
                        if (service.isContentOwner()) {
                            deferred.resolve();
                        }
                        else {
                            if (service.isAuthenticated()) {
                                service.redirect('/login/upgrade');
                                deferred.resolve();
                            }
                            else
                                deferred.reject();
                        }
                    });
                }
                else {
                    if (service.isContentOwner()) {
                        deferred.resolve();
                    }
                    else {
                        if (service.isAuthenticated()) {
                            service.redirect('/login/upgrade');
                            deferred.resolve();
                        }
                        else
                            deferred.reject();
                    }
                }
                return deferred.promise;
            },
            // Is the current user authenticated?
            isAuthenticated: function () {
              return (currentUser !== null);
            },
            // Is the current user an collaborator
            // Content owners are NOT collaborators
            isCollaborator: function () {
              return (service.isAuthenticated() && angular.equals(currentAccount.account_type, 'collaborator'));
            },
            // Is the current user an creator?
            isContentOwner: function () {
              return (service.isAuthenticated() && angular.equals(currentAccount.account_type, 'content_owner'));
            },
            // Is the current users registration complete (for twitter users)?
            isProfileComplete: function () {
              return !!(currentUser && currentUser.user_name);
            },
            getUser: function () {
                return currentUser;
            },
            getAccount: function () {
                return currentAccount;
            },
            logout: function (redirectTo) {
              $http.get('/logout').then(function () {
                debug.info('logout');
                _resetAccountAndUserDetails();
                checkingLogin.request = null;
                checkingLogin.response = new $q.defer();
                $location.path(redirectTo || '/login');
              });
            },
            login: function (username, password) {
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
            getExternalCredentials: function () {
                return externalCredentials;
            }
        };

        return service;
    }

    var securityAuthorizationProvider = function () {
      return {
        loadAuthentication: ['securityAuthorization', function (securityAuthorization) {
            return securityAuthorization.loadAuthentication();
          }],
        requireAuthenticated: ['securityAuthorization', function (securityAuthorization) {
            return securityAuthorization.requireAuthenticated();
          }],
        requireCollaborator: ['securityAuthorization', function (securityAuthorization) {
            return securityAuthorization.requireCollaborator();
          }],
        requireContentOwner: ['securityAuthorization', function (securityAuthorization) {
            return securityAuthorization.requireContentOwner();
          }],

          $get: ['SecurityService', function (security) {
            var service = {
              // Load an authenticated user, if logged in, but don't require a logged in user
              // (use this in a route resolve to load users details without requiring authentication)
              loadAuthentication: function () {
                return security.loadAuthentication();
              },
              // Require that there is an authenticated user
              // (use this in a route resolve to prevent non-authenticated users from entering that route)
              requireAuthenticated: function () {
                return security.requireAuthenticated();
              },

              // Require that there is an collaborator, this will not allow content owner in
              // (use this in a route resolve to prevent non-authenticated users from entering that route)
              requireCollaborator: function () {
                return security.requireCollaborator();
              },

              // Require that there is an creator logged in
              // (use this in a route resolve to prevent non-creators from entering that route)
              requireContentOwner: function () {
                return security.requireContentOwner();
              }

            };

            return service;
          }]
      };
    };

    angular.module('RomeoApp.security').factory('SecurityService', ['$location', '$q', '$http', '$timeout', 'localStorageService', SecurityService]);
    angular.module('RomeoApp.security').provider('securityAuthorization', securityAuthorizationProvider);
})();
