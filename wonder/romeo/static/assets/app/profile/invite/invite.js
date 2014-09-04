(function () {

  'use strict';
  var debug = new DebugClass('RomeoApp.profile.directives');

  function profileInvite($templateCache, modal) {
    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('profile/invite/invite.tmpl.html'),
      scope : {
        profile: '='
      },
      controller : function ($scope) {
        $scope.sendInvite = function () {
          console.log($scope.invitation);
          $scope.$emit('send-invitation-request', $scope.invitation);
          modal.hide();
        };

        $scope.invite = function () {
          modal.load('profile/invite/invite-modal.tmpl.html', true, $scope);
          console.log($scope.profile);
          $scope.invitation = {
            user: $scope.profile.id
          };
        };

        $scope.close = function () {
          modal.hide();
          $scope.invitation = null;
        };
      }
    };
  }

  angular.module('RomeoApp.profile').directive('profileInvite', ['$templateCache', 'modal', profileInvite]);

})();
