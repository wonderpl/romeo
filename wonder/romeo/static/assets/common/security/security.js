(function () {
    'use strict';

    function SecurityService($rootScope, $location, $q, $http, $timeout, localStorageService) {
        var debug = new DebugClass('SecurityService'),
            currentUser = null,
            currentAccount = null,
            loginAttempts = 0,
            originalUrl = null,
            checkingLogin = { request: null, response: new $q.defer() },
            externalCredentials = null,
            registrationToken = $location.search().reg_token,
            _acceptConnection = false,
            _token = false;

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

        function _validateCollaborateToken(token) {
            console.trace();
            return $http({
                method  : 'post',
                url     : '/api/validate_token',
                data    : { 'token' : token }
            }).success(function (data) {
                $rootScope.$emit('notify', {
                    status : 'success',
                    title : 'Video collaboration',
                    message : 'You have accepted collaborating on this video'}
                );
            }).error(function () {
                $rootScope.$emit('notify', {
                    status : 'error',
                    title : 'Video collaboration',
                    message : 'Couldn\'t accept your video token'}
                );
            });
        }

        function _validateAcceptConnection(accept_connection) {
            console.trace();
            return $http({
                method  : 'post',
                url     : '/api/user/' + currentUser.id + '/connections',
                data    : {user: $location.search().accept_connection}
            }).success(function () {
                $rootScope.$emit('notify', {
                    status : 'success',
                    title : 'Accepted connection',
                    message : 'Your new connection has been accepted'}
                );
            }).error(function () {
                $rootScope.$emit('notify', {
                    status : 'error',
                    title : 'Accepted connection',
                    message : 'Your new connection failed'}
                );
            });
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
                        // Set user to have already logged in at least once to be
                        // redirected from the marketing home page
                        if (localStorage)
                            localStorage.appRedirect = true;
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

        function _findUser() {
            var deferred = new $q.defer();
            if (! service.isAuthenticated() ) {
                _loginCheck().then(function (res) {
                    deferred.resolve(res);
                }, function (res) {
                    deferred.reject(res);
                });
            }
            else {
                deferred.resolve({'user': currentUser, 'account': currentAccount});
            }
            return deferred.promise;
        }

        function _getRegistrationHeaders() {
            var headers = {};
            // Bearer token required for closed beta
            if (registrationToken) {
              headers.Authorization = 'Bearer ' + registrationToken;
            }
            return headers;
        }

        var service = {
            restoreUrl: function (url) {
                $location.url(originalUrl || url || '/search');
                originalUrl = null;
            },
            redirect: function (url) {
                // If the url wasn't login set the url to redirect back to after login
                if ($location.url() && $location.url() === '/' && $location.url().indexOf('/login') === -1)
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

                var queue = _findUser();
                queue.then(function () {
                    var query = $location.search();
                    var token = query ? query.token : null;
                    var acceptConnection = query ? query.accept_connection : null;
                    if (token && token !== _token) {
                        _token = token;
                        _validateCollaborateToken(token);
                    }
                    if (acceptConnection && acceptConnection !== _acceptConnection) {
                        _acceptConnection = acceptConnection;
                        _validateAcceptConnection(acceptConnection);
                    }
                });
                return queue;
            },
            requireCollaborator: function () {
                var deferred = new $q.defer();
                service.requireAuthenticated().then(function () {
                    if (service.isCollaborator()) {
                        deferred.resolve();
                    }
                }, deferred.reject);
                return deferred.promise;
            },
            requireContentOwner: function () {
                var deferred = new $q.defer();
                service.requireAuthenticated().then(function () {
                    if (service.isAuthenticated()) {
                        if (! service.isContentOwner()) {
                            service.redirect('/login/upgrade');
                        }
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }, deferred.reject);
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
                    data: data,
                    headers: _getRegistrationHeaders()
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
                request = $http.post('/api/login/external', data,
                                     {headers: _getRegistrationHeaders()});
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

    angular.module('RomeoApp.security').factory('SecurityService', ['$rootScope', '$location', '$q', '$http', '$timeout', 'localStorageService', SecurityService]);
    angular.module('RomeoApp.security').provider('securityAuthorization', securityAuthorizationProvider);
})();
