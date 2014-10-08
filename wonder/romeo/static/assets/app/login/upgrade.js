(function () {
'use strict';
var debug = new DebugClass('controller.UpgradeController');

function UpgradeController($scope, $location, AccountService) {
    $scope.isLoading = false;
    $scope.upgrade = function () {
        $scope.isLoading = true;
        var tokens = {
            'stripeToken': 'demo',
            'payment_token': 'demo'
        };

        AccountService.upgradeToContentOwner(tokens).then(function () {
            $location.url('/video');
            $scope.$emit('notify', {
              status : 'success',
              title : 'Upgrade account',
              message : 'Your account has been upgraded'
            });
        }, function () {
            $scope.$emit('notify', {
              status : 'error',
              title : 'Upgrade account',
              message : 'Failed to upgrade your account, already a content owner?'
            });
        });
    };
}

angular.module('RomeoApp.login')
    .controller('UpgradeCtrl', ['$scope', '$location', 'AccountService', UpgradeController]);
})();