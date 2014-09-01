
/*  Romeo Prototype
 /* ================================== */

(function() {
    'use strict';

    // Define all the sub modules of the app here so we can include files in any order
    // * Common modules, modules in common should never depend on modules in App so they come first
    angular.module('RomeoApp.filters', []);
    angular.module('RomeoApp.security', []);
    angular.module('RomeoApp.services', ['RomeoApp.security']);
    angular.module('RomeoApp.directives', ['RomeoApp.services']);
    angular.module('RomeoApp.controllers', ['RomeoApp.services', 'RomeoApp.directives', 'LocalStorageModule']);
    // * App modules
    angular.module('RomeoApp.profile', ['RomeoApp.services', 'RomeoApp.directives', 'RomeoApp.security', 'ngRoute']);

    var debug = new DebugClass('App');

    var app = angular.module('RomeoApp' /* module name */,
        ['RomeoApp.controllers',
            'RomeoApp.security',
            'RomeoApp.services',
            'RomeoApp.directives',
            'RomeoApp.filters',
            'RomeoApp.analytics',
            'RomeoApp.profile',
            'ngRoute',
            'ngCookies',
            'angular-medium-editor',
            'angularFileUpload',
            'angulartics',
            'angulartics.google.analytics'] /* module dependencies */);

    app.config(['$routeProvider', '$interpolateProvider', '$httpProvider', 'securityAuthorizationProvider',
      function( $routeProvider, $interpolateProvider, $httpProvider, securityAuthorizationProvider ){

        var sessionUrl;
        var authChecks = {
            loggedin: function(ErrorService, AuthService, AccountService, $q) {
                var dfd = new $q.defer();
                debug.info('Login: App.authChecks.loggedid');
                AuthService.loginCheck().then(function () {
                    dfd.resolve();
                    AccountService.getUser();
                },
                    function () {
                        debug.info('Login: App.authChecks.loggedid - User not logged in, check for token');
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
            resolve: securityAuthorizationProvider.requireCollaborator
        });

        // Organise
        $routeProvider.when('/organise/:id', {
            templateUrl: 'organise.html',
            resolve: securityAuthorizationProvider.requireCollaborator
        });

        // Videos
        $routeProvider.when('/video', {
            templateUrl: 'video.html',
            resolve: securityAuthorizationProvider.requireCollaborator
        });

        // Videos
        $routeProvider.when('/video/:id', {
            templateUrl: 'video.html',
            resolve: securityAuthorizationProvider.requireCollaborator
        });

        // Videos
        $routeProvider.when('/video/:id/comments', {
            templateUrl: 'video.html',
            resolve: securityAuthorizationProvider.requireCollaborator
        });

        // Videos
        $routeProvider.when('/video/:id/edit', {
            templateUrl: 'video.html',
            resolve: securityAuthorizationProvider.requireCollaborator
        });

        $routeProvider.when('/search', {
          templateUrl: 'search.html',
          resolve: securityAuthorizationProvider.requireCollaborator,
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
            resolve: securityAuthorizationProvider.requireCollaborator
        });

        $routeProvider.when('/analytics/:videoID', {
            templateUrl: 'analytics.html',
            resolve: securityAuthorizationProvider.requireCollaborator
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
            debug.log( error );
            if (error instanceof ErrorService.AuthError) {
                $location.url($location.path());
                $location.url('/login');
            }
        });

    }]);

})();
