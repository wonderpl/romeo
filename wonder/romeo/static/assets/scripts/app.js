
/*  Romeo Prototype
 /* ================================== */

(function(w,d,n,ng,ns) {

    'use strict';

    var app = ng.module(ns /* module name */,
        [ns + '.controllers',
                ns + '.services',
                ns + '.filters',
                ns + '.analytics',
            'ngRoute',
            'ngCookies',
            'angularFileUpload'] /* module dependencies */);

    app.config(['$routeProvider', '$interpolateProvider', '$httpProvider', function( $routeProvider, $interpolateProvider, $httpProvider, $location ){
        var sessionUrl;
        var authChecks = {
            session: function(ErrorService, AuthService, $q) {
                if (sessionUrl = AuthService.getSession()) {
                    if (AuthService.isLoggedIn()) {
                        return $q.when(true);
                    } else {
                        // It could be for some reason we don't have a HTTP cookie so try twice...
                        return AuthService.retrieveSession(sessionUrl).then(function (sessionData) {
                            AuthService.setSession(sessionData);
                        }, function(response) {
                            if (response.status === 401) {
                                return AuthService.retrieveSession(sessionUrl).then(function (sessionData) {
                                    AuthService.setSession(sessionData);
                                });
                            } else {
                                return $q.reject(new ErrorService.AuthError('server_session_error'));
                            }
                        });
                    }
                } else {
                    return $q.reject(new ErrorService.AuthError('no_session'));
                }
            }
        };

        // Change the interpolation symbols so they don't conflict with Jinja
        $interpolateProvider.startSymbol('(~');
        $interpolateProvider.endSymbol('~)');

        // Library
        $routeProvider.when('/library', {
            templateUrl: 'library.html',
            resolve: authChecks
        });

        // Videos
        $routeProvider.when('/video/:videoID', {
            templateUrl: 'video.html'
        });

        // Analytics
        // Types can be
        // - /geographic/
        // - /general/
        // - /engagement/
        $routeProvider.when('/analytics/:videoID/:type', {
            templateUrl: 'analytics.html',
            resolve: authChecks
        });

        // Video upload
        $routeProvider.when('/upload', {
            templateUrl: 'upload.html',
            resolve: authChecks
        });

        // Account management
        $routeProvider.when('/account/:accountID', {
            templateUrl: 'account.html'
        });

        $routeProvider.when('/login', {
            templateUrl: 'login.html'
        });

        $routeProvider.when('/loading', {
            templateUrl: 'loading.html'
        });

        $routeProvider.when('/logout', {
            templateUrl: 'login.html'
        });

        $routeProvider.otherwise({redirectTo: '/login'});


        $httpProvider.defaults.headers.patch = {
            'Content-Type': 'application/json;charset=utf-8'
        };

    }]);

    app.run(['$timeout', '$rootScope', '$http', 'animLoop', '$cookies', '$location', 'ErrorService', function($timeout, $rootScope, $http, animLoop, $cookies, $location, ErrorService) {

        $rootScope.$on('$routeChangeError', function(evt, next, last, error) {
            if (error instanceof ErrorService.AuthError) {
                $location.url('/login');
            }
        });

        animLoop.setFPS(15);
    }]);

})(window,document,navigator,window.angular,'RomeoApp');
