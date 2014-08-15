
/*  Romeo Prototype
 /* ================================== */

(function(w,d,n,ng,ns) {

    'use strict';

    var app = ng.module(ns /* module name */,
        [ns + '.controllers',
                ns + '.services',
                ns + '.directives',
                ns + '.stats-services',
                ns + '.filters',
                ns + '.analytics',
            'ngRoute',
            'ngCookies',
            'angularFileUpload',
            'angulartics',
            'angulartics.google.analytics'] /* module dependencies */);

    app.config(['$routeProvider', '$interpolateProvider', '$httpProvider',
      function( $routeProvider, $interpolateProvider, $httpProvider ){

        var sessionUrl;
        var authChecks = {
            loggedin: function(ErrorService, AuthService, $q) {
                var dfd = new $q.defer();
                console.info('Login: App.authChecks.loggedid');
                AuthService.loginCheck().then(dfd.resolve,
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


        // Account management
        $routeProvider.when('/profile', {
            templateUrl: 'profile.html',
            resolve: authChecks
        });



/******* DEPRECATED **************************************************/

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

/******* DEPRECATED **************************************************/



        $routeProvider.otherwise({redirectTo: '/organise'});

        $httpProvider.defaults.headers.patch = {
            'Content-Type': 'application/json;charset=utf-8'
        };

    }]);

    app.run(['$route', '$rootScope', 'animLoop', '$location', 'ErrorService',
      function($route, $rootScope, animLoop, $location, ErrorService) {

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

        animLoop.setFPS(15);
    }]);

})(window,document,navigator,window.angular,'RomeoApp');

function DebugClass(name) {
    'use strict';
    var debugName = name;
    var show = false;

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
        }
        return "";
    }

    if (typeof console !== 'undefined') {
        var cookie = getCookie('debug');
        if (cookie && (cookie == 'all' || cookie.indexOf(debugName) != -1)) {
            show = true;
        }
    }

    return {
        log: function(msg) {
            if (show)
                console.log(name + ': ' + msg);
        },
        info: function(msg) {
            if (show)
                console.info(name + ': ' + msg);
        },
        warn: function(msg) {
            if (show)
                console.warn(name + ': ' + msg);
        },
        error: function(msg) {
            if (show)
                console.error(name + ': ' + msg);
        },
        trace: function(obj) {
            if (show)
                console.trace(obj);
        },
        dir: function(obj) {
            if (show) {
                console.group(name);
                console.dir(obj);
                console.groupEnd();
            }
        },
        group: function(msg) {
            if (show)
                console.group(name + ': ' + msg);
        },
        groupEnd: function() {
            if (show)console.groupEnd();
        }
    };
}