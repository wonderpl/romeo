//  Romeo App
// ==================================

(function() {
    'use strict';

    // Define all the sub modules of the app here so we can include files in any order
    // -- Common modules, modules in common should never depend on modules in App so they come first
    angular.module('RomeoApp.filters', []);
    angular.module('RomeoApp.security', []);
    angular.module('RomeoApp.services', ['RomeoApp.security']);
    angular.module('RomeoApp.directives', ['RomeoApp.services', 'ui.select2']);
    angular.module('RomeoApp.controllers', ['RomeoApp.services', 'RomeoApp.directives', 'LocalStorageModule']);
    // -- App modules
    angular.module('RomeoApp.analytics', ['RomeoApp.directives', 'nvd3ChartDirectives', 'ngRoute']);
    angular.module('RomeoApp.profile', ['RomeoApp.services', 'RomeoApp.directives', 'RomeoApp.security', 'ngRoute']);
    angular.module('RomeoApp.search', ['RomeoApp.services', 'RomeoApp.directives', 'RomeoApp.security', 'ngRoute']);
    angular.module('RomeoApp.video', ['RomeoApp.services', 'RomeoApp.directives', 'RomeoApp.security', 'ngRoute']);
    angular.module('RomeoApp.publish', ['RomeoApp.services', 'RomeoApp.directives', 'RomeoApp.security', 'ngRoute']);

    var debug = new DebugClass('App');

    var app = angular.module('RomeoApp', // module name
        [
            'ngRoute',
            'ngCookies',
            'ngSanitize',
            'angular-medium-editor',
            'angularFileUpload',
            'angulartics',
            'angulartics.google.analytics',
            'nvd3ChartDirectives',
            'RomeoApp.filters',
            'RomeoApp.security',
            'RomeoApp.services',
            'RomeoApp.directives',
            'RomeoApp.controllers',
            'RomeoApp.analytics',
            'RomeoApp.profile',
            'RomeoApp.search',
            'RomeoApp.video',
            'RomeoApp.publish'
        ]); // module dependencies

    app.config(['$routeProvider', '$interpolateProvider', '$httpProvider', 'securityAuthorizationProvider',
      function( $routeProvider, $interpolateProvider, $httpProvider, securityAuthorizationProvider ){

        // Change the interpolation symbols so they don't conflict with Jinja
        $interpolateProvider.startSymbol('(~');
        $interpolateProvider.endSymbol('~)');

        // Organise
        $routeProvider.when('/organise', {
            templateUrl: 'organise/organise.tmpl.html',
            controller: 'OrganiseCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Organise
        $routeProvider.when('/organise/:id', {
            templateUrl: 'organise/organise.tmpl.html',
            controller: 'OrganiseCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Videos
        $routeProvider.when('/video', {
            templateUrl: 'video.html',
            controller: 'VideoCtrl',
            resolve: securityAuthorizationProvider.requireContentOwner
        });

        // Videos
        $routeProvider.when('/video/:id', {
            templateUrl: 'video.html',
            controller: 'VideoCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        // Videos
        $routeProvider.when('/video/:id/comments', {
            templateUrl: 'video.html',
            controller: 'VideoCtrl',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

// ****** DEPRECATED **************************************************

        // Analytics
        // Types can be
        // - /geographic/
        // - /general/
        // - /engagement/
        $routeProvider.when('/analytics/:videoID/:type', {
            templateUrl: 'analytics.html',
            controller: 'AnalyticsController',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        $routeProvider.when('/analytics/:videoID', {
            templateUrl: 'analytics.html',
            controller: 'AnalyticsController',
            resolve: securityAuthorizationProvider.requireAuthenticated
        });

        $routeProvider.when('/logout', {
            controller: 'LoginCtrl',
            templateUrl: 'login.html'
        });

// ******* END DEPRECATED **************************************************

        $routeProvider.when('/login', {
            controller: 'LoginCtrl',
            templateUrl: 'login.html'
        });

        $routeProvider.when('/login/twitter', {
            controller: 'TwitterLoginCtrl',
            templateUrl: 'twitter-login.html'
        });

        $routeProvider.when('/signup', {
            controller: 'SignupCtrl',
            templateUrl: 'signup.html'
        });

        $routeProvider.when('/login/upgrade', {
            controller: 'UpgradeCtrl',
            templateUrl: 'login/upgrade/upgrade.tmpl.html',
            resolve: securityAuthorizationProvider.requireCollaborator
        });

        $routeProvider.when('/faq', {
            templateUrl: 'pages/faq.tmpl.html',
            resolve: securityAuthorizationProvider.loadAuthentication
        });

        $routeProvider.when('/', {
            templateUrl: 'pages/home.tmpl.html',
            resolve: securityAuthorizationProvider.loadAuthentication
        });

        $routeProvider.otherwise({redirectTo: '/organise'});

        $httpProvider.defaults.headers.patch = {
            'Content-Type': 'application/json;charset=utf-8'
        };

    }]);

    app.run(['$route', '$rootScope', '$location', 'SecurityService',
      function($route, $rootScope, $location, SecurityService) {

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


      // Listen for route change errors, ie. access denied
      $rootScope.$on('$routeChangeError', function(error){
          console.error('route fail', error);
          SecurityService.redirect();
      });

      // @TODO: Move into modal service
      $rootScope.closeModal = function () {
          modal.hide();
      };
    }]);

})();
