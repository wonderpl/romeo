angular
  .module('RomeoApp.controllers')
  .controller('MainCtrl', ['$window', '$scope', '$rootScope', '$location', '$cookies', 'modal', 'localStorageService', 'SecurityService', 'UserService', MainController]);

function MainController ($window, $scope, $rootScope, $location, $cookies, modal, localStorageService, SecurityService, UserService) {

  'use strict';

  function init() {
    /*
    * Empty state objects for when we have data
    */
    $scope.profile = '';

    if (SecurityService.isAuthenticated() && $location.search().accept_connection) {
      console.log('Accept connection: ' + $location.search().accept_connection);
      UserService.connect({user: $location.search().accept_connection}).then(
        function () {
          $scope.$emit('notify', {
            status : 'success',
            title : 'Accepted connection',
            message : 'Your new connection has been accepted'}
          );
        }, function () {
          $scope.$emit('notify', {
            status : 'error',
            title : 'Accept connection',
            message : 'Your new connection failed'}
          );
        }
      );
    }
  }

  init();
}
