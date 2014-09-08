angular
  .module('RomeoApp.controllers')
  .controller('MainCtrl', ['$window', '$scope', '$rootScope', '$location', '$cookies', 'modal', 'localStorageService', 'SecurityService', 'UserService', MainController]);

function MainController ($window, $scope, $rootScope, $location, $cookies, modal, localStorageService, SecurityService, UserService) {

  'use strict';

  function init() {
    /*
    * Empty state objects for when we have data
    */
    $rootScope.isComments = false;
    $rootScope.layoutMode = $cookies.layout ? $cookies.layout : (SecurityService.isCollaborator()) ? 'column' : 'wide';
    $scope.profile = '';
    $scope.currentRoute = $location;

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
        });
    }
  }

  $rootScope.isUnique = function (arr, string) {
      if (arr.length === 0) {
          return true;
      }
      for (var i = 0; i < arr.length; i++) {
          if (arr[i] === string) return false;
      }
      return true;
  };

  $rootScope.closeModal = function () {
      modal.hide();
  };

  /*
  * Used in templating for logic based on the current route
  */
  $rootScope.isCurrentPage = function (route) {
      return route === $location.path();
  };

  /*
  * Returns the current route in plain text
  */
  $rootScope.getCurrentRoute = function () {
      return $location.path().split('/')[1];
  };

  /*
  * Strips out any HTML tags and pasts in plain text
  */
  $rootScope.cleanPaste = function(e){
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
  };

  /*
  * Useful function for determining whether an object is empty or not
  */
  $rootScope.isEmpty = function(obj){
      return $.isEmptyObject(obj);
  };

  init();
}
