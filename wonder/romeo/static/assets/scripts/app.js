
/*  Romeo Prototype
 /* ================================== */

(function() {
    'use strict';

    // Define all the sub modules of the app here so we can include files in any order
    // -- Common modules, modules in common should never depend on modules in App so they come first
    angular.module('RomeoApp.filters', []);
    angular.module('RomeoApp.security', []);
    angular.module('RomeoApp.services', ['RomeoApp.security']);
    angular.module('RomeoApp.directives', ['RomeoApp.services']);
    angular.module('RomeoApp.controllers', ['RomeoApp.services', 'RomeoApp.directives', 'LocalStorageModule']);
    // -- App modules
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

        // Change the interpolation symbols so they don't conflict with Jinja
        $interpolateProvider.startSymbol('(~');
        $interpolateProvider.endSymbol('~)');

        // Organise
        $routeProvider.when('/organise', {
            templateUrl: 'organise.html',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Organise
        $routeProvider.when('/organise/:id', {
            templateUrl: 'organise.html',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Videos
        $routeProvider.when('/video', {
            templateUrl: 'video.html',
            resolve: securityAuthorizationProvider.requireCreator
        });

        // Videos
        $routeProvider.when('/video/:id', {
            templateUrl: 'video.html',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Videos
        $routeProvider.when('/video/:id/comments', {
            templateUrl: 'video.html',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Videos
        $routeProvider.when('/video/:id/edit', {
            templateUrl: 'video.html',
            resolve: securityAuthorizationProvider.requireCreator
        });

        $routeProvider.when('/search', {
          templateUrl: 'search.html',
          resolve: securityAuthorizationProvider.requireAuthenticated,
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
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        $routeProvider.when('/analytics/:videoID', {
            templateUrl: 'analytics.html',
            resolve: securityAuthorizationProvider.requireAuthenticated
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

    app.run(['$route', '$rootScope', '$location', '$cookies', '$window', 'SecurityService', 'ErrorService',
      function($route, $rootScope, $location, $cookies, $window, SecurityService, ErrorService) {

      // http://joelsaupe.com/programming/angularjs-change-path-without-reloading/
      // $location.path('/sample/' + $rootScope.checkinId, false);
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

      /*
      * Listen for route change errors
      */
      $rootScope.$on('$routeChangeError', function(error){
          console.error('route fail', error);
          SecurityService.redirect();
      });
    }]);

})();
