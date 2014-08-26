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
          modal.hide();
        };

        $scope.invite = function () {
          modal.load('profile/invite/invite-modal.tmpl.html', true, $scope);
          $scope.invitation = {};
        };

        $scope.close = function () {
          modal.hide();
        };
      }
    };
  }

  angular.module('RomeoApp.profile.directives').directive('profileInvite', ['$templateCache', 'modal', profileInvite]);

})();
