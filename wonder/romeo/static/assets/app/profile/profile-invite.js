(function () {

  'use strict';
  var debug = new DebugClass('RomeoApp.profile.invite');

  function profileInvite($templateCache, modal) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('profile/profile-invite.modal.html'),
      scope : true,
      controller : function ($scope) {
        $scope.sendInvite = function () {
          console.log($scope.invitation);
          $scope.$emit('send-invitation-request', $scope.invitation);
          modal.hide();
        };

        $scope.invitation = {
          user: $scope.profile.id
        };

        $scope.close = function () {
          modal.hide();
          $scope.invitation = null;
        };
      }
    };
  }

  angular.module('RomeoApp.profile').directive('profileInviteModal', ['$templateCache', 'modal', profileInvite]);

})();
