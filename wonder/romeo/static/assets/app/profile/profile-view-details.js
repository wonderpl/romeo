angular.module('RomeoApp.profile')

.directive('profileViewDetails', ['$templateCache', 'UserService',
	function($templateCache, UserService) {
    'use strict';
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('profile/profile-view-details.dir.html'),
      scope : true,
      controller: function ($scope) {
        $scope.isConnectedTo = function () {
          var userId = UserService.getUser().id;
          if ($scope.flags.userId === userId)
            return true;
          if ($scope.connections) {
            for (var i = 0; i < $scope.connections.length; ++i) {
              if ($scope.connections[i].user.id === userId)
                return true;
            }
          }
          return false;
        };
      }
    };
	}
]);