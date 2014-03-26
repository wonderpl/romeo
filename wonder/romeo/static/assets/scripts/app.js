
/*  Romeo Prototype
/* ================================== */

(function(w,d,n,ng,ns) {

    'use strict';

    var app = ng.module(ns /* module name */,
                       [ns + '.controllers',
                        ns + '.services',
                        ns + '.filters',
                        ns + '.analytics',
                        'ngRoute', 'ngGrid'] /* module dependencies */);

    app.config(['$routeProvider', '$interpolateProvider', function( $routeProvider, $interpolateProvider ){
        
        // Change the interpolation symbols so they don't conflict with Jinja
        $interpolateProvider.startSymbol('<(');
        $interpolateProvider.endSymbol(')>');

        // Home
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard.html'
        });

        // Library
        $routeProvider.when('/library', {
            templateUrl: 'library.html'
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
            templateUrl: 'analytics.html'
        });

        // Video upload
        $routeProvider.when('/upload', {
            templateUrl: 'upload.html'
        });

        // Account management
        $routeProvider.when('/account', {
            templateUrl: 'account.html'
        });
        
        $routeProvider.otherwise({redirectTo: '/dashboard'});
    }]);

    app.run(['$timeout', '$rootScope', '$http', 'animLoop', function($timeout, $rootScope, $http, animLoop) {
        animLoop.setFPS(15);
    }]);

})(window,document,navigator,window.angular,'RomeoApp');