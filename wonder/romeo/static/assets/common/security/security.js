angular.module('RomeoApp.security', ['RomeoApp.services'])

.factory('SecurityService', ['$location', '$q', 'AuthService', 'AccountService', function($location, $q, AuthService, AccountService) {
	'use strict';
	var debug = new DebugClass('SecurityService');
	var currentUser = null;
	var loginAttempts = 0;

	var service = {
		requireCollaborator: function () {
			if (! service.isCollaborator() ) 
				$location.$path('/login');
		},
		requireCreator: function () {
			if (! service.isLoggedIn() || !currentUser.isCreator)
				$location.$path('/login');
			else if (! service.isProfileComplete() )
				$location.$path('/signup/complete');
		},
		// Is the current user authenticated?
	    isAuthenticated: function(){
	      return !!currentUser;
	    },
	    // Is the current user an collaborator or better?
	    // All logged in users are at least collaborators
	    isCollaborator: function() {
	      return !!currentUser;
	    },
	    // Is the current user an creator?
	    isCreator: function() {
	      return !!(currentUser && angular.equals(currentUser.account_type, 'creator'));
	    },
	    logout: function(redirectTo) {
	      $http.post('/api/logout').then(function() {
	        currentUser = null;
	        $location.path(redirectTo || '/login');
	      });
	    },
		login: function() {
			var deferred = new $q.defer();
			if (loginAttempts >= 3) {
				deferred.reject('Too many login attempts');
				return deferred.promise;
			}

			AuthService.loginCheck().then(function () {
                debug.info('Login - User logged in, fetching profile');
                AccountService.getUser().then(function (data) {
                	currentUser = data;
                	deferred.resolve(data);
                }, deferred.reject);
            }, function () {
                debug.info('Login - User not logged in, check for token');
                AuthService.collaboratorCheck().then(deferred.resolve, deferred.reject);
            });

            deferred.then(function () {
            	loginAttempts = 0;
            }, function () {
            	++loginAttempts;
            });

            return deferred.promise;
		},
		getUser: function () {
			return currentUser;
		},
		// Is the current users registration complete (for twitter users)?
	    isProfileComplete: function(){
	      return !!(currentUser && currentUser.user_name);
	    }
	};

	return service;
}])

.provider('securityAuthorization', {
  requireCreator: ['securityAuthorization', function(securityAuthorization) {
  	'use strict';
    return securityAuthorization.requireCreator();
  }],

  requireCollaborator: ['securityAuthorization', function(securityAuthorization) {
  	'use strict';
    return securityAuthorization.requireCollaborator();
  }],

  $get: ['SecurityService', '$location', function(security, $location) {
  	'use strict';
    var service = {

      // Require that there is an authenticated user
      // (use this in a route resolve to prevent non-authenticated users from entering that route)
      requireCollaborator: function() {
		if (! security.isCollaborator() ) 
			$location.path('/login');
		else if (! security.isProfileComplete() )
			$location.path('/signup/complete');
      },

      // Require that there is an creator logged in
      // (use this in a route resolve to prevent non-creators from entering that route)
      requireCreator: function() {
		if (! security.isLoggedIn() || !security.isCreator())
			$location.path('/login');
		else if (! security.isProfileComplete() )
			$location.path('/signup/complete');
      }

    };

    return service;
  }]
});