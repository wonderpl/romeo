angular
  .module('RomeoApp.controllers')
  .controller('MainCtrl', ['$window', '$scope', '$rootScope', '$timeout', '$location', '$modal', '$element', '$cookies', 'localStorageService', 'AuthService', MainController]);

function MainController ($window, $scope, $rootScope, $timeout, $location, $modal, $element, $cookies, localStorageService, AuthService) {

  'use strict';

  /*
  * Empty state objects for when we have data
  */
  $rootScope.User = {};
  $rootScope.Videos = {};
  $rootScope.Tags = {};

  $rootScope.isComments = false;

  $rootScope.layoutMode = $cookies.layout ? $cookies.layout : 'column';

  $scope.profile = '';

  $scope.currentRoute = $location;

  $window.onbeforeunload = function () {

    return $scope.upload.status === 'uploading' ? 'Leaving this page will cancel your video upload.' : '';
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
      $modal.hide();
  };

  $rootScope.logOut = function () {
      localStorageService.remove('session_url');
      $location.path('/login');
  };

  $rootScope.toggleNav = function () {

  };

  $rootScope.$on('notify', function (event, data) {
    $rootScope.$broadcast('notify-tray', data);
  });

  $scope.$on('video-upload-start', function (event) {
    $scope.upload = {};
    $scope.upload.status = 'uploading';
    $scope.upload.progress = 0;
  });

  $scope.$on('video-upload-progress', function (event, data) {
    $scope.$apply(function () {
      $scope.upload.status = 'uploading';
      $scope.upload.progress = data.progress;
    });
  });

  $scope.$on('video-upload-complete', function (event) {
    $scope.upload.status = 'processing';
  });

  $scope.$on('video-upload-success', function (event, data) {
    $scope.upload.href = '#/video/' + data.id + '/edit';
    $scope.upload.status = 'upload complete';
  });

  /*
  * Listen for route change errors
  */
  $rootScope.$on('$routeChangeError', function(error){
      console.log('route fail', arguments);
      AuthService.redirect();
  });

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

}
