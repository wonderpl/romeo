
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
                        'ngCookies'] /* module dependencies */);

    app.factory('$loginCheck', ['localStorageService', '$timeout', '$rootScope', '$http', '$location', '$q', function(localStorageService, $timeout, $rootScope, $http, $location, $q){
        return function(){

            var session_url = localStorageService.get('session_url');

            if ( session_url !== null && $rootScope.account !== undefined ) {
                console.log(' AUTHED ');

            } else if ( session_url === null ) {
                console.log(' NOT AUTHED ');
                $location.path('/login');

            }
            
            // else if ( $rootScope.account === undefined ) {
            //     console.log(' KIND OF AUTHED ');
            //     $http({ method: 'get', url: localStorageService.get('session_url') }).success(function(data,status,headers,config){
            //         $timeout(function() {
            //             $rootScope.$apply(function(){
            //                 $rootScope.account = data;
            //                 $rootScope.userID = data.href.split('/');
            //                 $rootScope.userID = $rootScope.userID[$rootScope.userID.length-1];
            //                 console.log('DEFINITELY AUTHED NOW');
            //                 deferred.resolve(data);
            //             });
            //         });
            //     });
            //     return deferred.promise;
            // }

        };
    }]);

    app.config(['$routeProvider', '$interpolateProvider', function( $routeProvider, $interpolateProvider ){
    
        // Change the interpolation symbols so they don't conflict with Jinja
        $interpolateProvider.startSymbol('(~');
        $interpolateProvider.endSymbol('~)');

        // Home
        // $routeProvider.when('/dashboard', {
        //     templateUrl: 'dashboard.html'
        // });

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
    }]);

    app.run(['$timeout', '$rootScope', '$http', 'animLoop', '$cookies', '$loginCheck', '$location', function($timeout, $rootScope, $http, animLoop, $cookies, $loginCheck, $location) {
        $loginCheck();
        animLoop.setFPS(15);
    }]);

})(window,document,navigator,window.angular,'RomeoApp');