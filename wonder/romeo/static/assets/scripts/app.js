
/*  Romeo Prototype
 /* ================================== */

(function(w,d,n,ng,ns) {

    'use strict';

    var app = ng.module(ns /* module name */,
        [ns + '.controllers',
                ns + '.services',
                ns + '.directives',
                ns + '.filters',
                ns + '.analytics',
                ns + '.profile',
            'ngRoute',
            'ngCookies',
            'angular-medium-editor',
            'angularFileUpload',
            'angulartics',
            'angulartics.google.analytics'] /* module dependencies */);

    app.config(['$routeProvider', '$interpolateProvider', '$httpProvider',
      function( $routeProvider, $interpolateProvider, $httpProvider ){

        var sessionUrl;
        var authChecks = {
            loggedin: function(ErrorService, AuthService, AccountService, $q) {
                var dfd = new $q.defer();
                console.info('Login: App.authChecks.loggedid');
                AuthService.loginCheck().then(function () {
                    dfd.resolve();
                    AccountService.getUser();
                },
                    function () {
                        console.info('Login: App.authChecks.loggedid - User not logged in, check for token');
                        AuthService.collaboratorCheck().then(dfd.resolve, dfd.reject);
                    });

                return dfd.promise;
            }
        };

        // Change the interpolation symbols so they don't conflict with Jinja
        $interpolateProvider.startSymbol('(~');
        $interpolateProvider.endSymbol('~)');

        // Organise
        $routeProvider.when('/organise', {
            templateUrl: 'organise.html',
            resolve: authChecks
        });

        // Organise
        $routeProvider.when('/organise/:id', {
            templateUrl: 'organise.html',
            resolve: authChecks
        });

        // Videos
        $routeProvider.when('/video', {
            templateUrl: 'video.html',
            resolve: authChecks
        });

        // Videos
        $routeProvider.when('/video/:id', {
            templateUrl: 'video.html',
            resolve: authChecks
        });

        // Videos
        $routeProvider.when('/video/:id/comments', {
            templateUrl: 'video.html',
            resolve: authChecks
        });

        // Videos
        $routeProvider.when('/video/:id/edit', {
            templateUrl: 'video.html',
            resolve: authChecks
        });

        $routeProvider.when('/search', {
          templateUrl: 'search.html',
          resolve: authChecks,
          reloadOnSearch: false
        });

        $routeProvider.when('/faq', {
            templateUrl: 'faq.html'
        });

/******* DEPRECATED **************************************************/

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

        $routeProvider.when('/loading', {
            templateUrl: 'loading.html'
        });

        $routeProvider.when('/logout', {
            templateUrl: 'login.html'
        });

/******* DEPRECATED **************************************************/

        $routeProvider.when('/login', {
            templateUrl: 'login.html'
        });

        $routeProvider.when('/twitter-login', {
            templateUrl: 'twitter-login.html'
        });

        $routeProvider.when('/signup', {
            templateUrl: 'signup.html'
        });

        $routeProvider.otherwise({redirectTo: '/organise'});

        $httpProvider.defaults.headers.patch = {
            'Content-Type': 'application/json;charset=utf-8'
        };

    }]);

    app.run(['$route', '$rootScope', '$location', 'ErrorService',
      function($route, $rootScope, $location, ErrorService) {

      // http://joelsaupe.com/programming/angularjs-change-path-without-reloading/
      // $location.path('/sample/' + $scope.checkinId, false);
      var original = $location.path;
      $location.path = function (path, reload) {
        if (reload === false) {
          var lastRoute = $route.current;
          var un = $rootScope.$on('$locationChangeSuccess', function () {
            $route.current = lastRoute;
            un();
          });
        }
        return original.apply($location, [path]);
      };

        $rootScope.$on('$routeChangeError', function(evt, next, last, error) {
            console.log( error );
            if (error instanceof ErrorService.AuthError) {
                $location.url($location.path());
                $location.url('/login');
            }
        });

    }]);

})(window,document,navigator,window.angular,'RomeoApp');
