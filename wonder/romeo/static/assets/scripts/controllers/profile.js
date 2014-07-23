angular.module('RomeoApp.controllers')
  .controller('ProfileCtrl', ['$scope', 'AccountService',
  function($scope, AccountService) {

  'use strict';

  $scope.isEdit = false;

  AccountService.getUser().then(function (data) {

    console.log(data);

    $scope.profile = data;

  });

}]);