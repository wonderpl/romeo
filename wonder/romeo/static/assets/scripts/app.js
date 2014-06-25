
/*  Romeo Prototype
 /* ================================== */

(function(w,d,n,ng,ns) {

    'use strict';

    var app = ng.module(ns /* module name */,
        [ns + '.controllers',
                ns + '.services',
                ns + '.stats-services',
                ns + '.filters',
                ns + '.analytics',
            'ngRoute',
            'ngCookies',
            'angularFileUpload'] /* module dependencies */);

    app.config(['$routeProvider', '$interpolateProvider', '$httpProvider', function( $routeProvider, $interpolateProvider, $httpProvider, $location ){

        var sessionUrl;
        var authChecks = {
            loggedin: function(ErrorService, AuthService, $q) {
                console.log('logged in authcheck');
                return AuthService.loginCheck();
            }
        };

        // Change the interpolation symbols so they don't conflict with Jinja
        $interpolateProvider.startSymbol('(~');
        $interpolateProvider.endSymbol('~)');

        // Manage
        $routeProvider.when('/manage', {
            templateUrl: 'manage.html',
            resolve: authChecks
        });

        $routeProvider.when('/manage/:filter/:id', {
            templateUrl: 'manage.html',
            resolve: authChecks
        });

        $routeProvider.when('/manage/:filter', {
            templateUrl: 'manage.html',
            resolve: authChecks
        });

        $routeProvider.when('/manage', {
            templateUrl: 'manage.html',
            resolve: authChecks
        });

        // Videos
        $routeProvider.when('/video/:videoID', {
            templateUrl: 'video.html'
        });



        // TEST
        $routeProvider.when('/prototype/:videoID', {
            templateUrl: 'prototype.html'
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

        $routeProvider.when('/analytics/:videoID', {
            templateUrl: 'analytics.html',
            resolve: authChecks
        });

        // Video upload
        $routeProvider.when('/upload/', {
            templateUrl: 'upload.html',
            resolve: authChecks
        });

        // Account management
        $routeProvider.when('/account', {
            templateUrl: 'account.html',
            resolve: authChecks
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

        $routeProvider.otherwise({redirectTo: '/upload'});

        $httpProvider.defaults.headers.patch = {
            'Content-Type': 'application/json;charset=utf-8'
        };

    }]);

    app.run(['$timeout', '$rootScope', '$http', 'animLoop', '$cookies', '$location', 'ErrorService', function($timeout, $rootScope, $http, animLoop, $cookies, $location, ErrorService) {

        $rootScope.$on('$routeChangeError', function(evt, next, last, error) {
            console.log( error );
            if (error instanceof ErrorService.AuthError) {
                $location.url('/login');
            }
        });

        animLoop.setFPS(15);
    }]);

})(window,document,navigator,window.angular,'RomeoApp');
