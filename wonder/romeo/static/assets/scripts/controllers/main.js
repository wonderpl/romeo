angular.module('RomeoApp.controllers').controller('MainCtrl',
    ['$scope', '$rootScope', '$timeout', '$location', '$modal', '$element', 'localStorageService', 'AuthService', 'UploadService', 'AccountService',
    function ($scope, $rootScope, $timeout, $location, $modal, $element, localStorageService, AuthService, UploadService, AccountService) {

    'use strict';

    /*
    * Empty state objects for when we have data
    */
    $rootScope.User = {};
    $rootScope.Videos = {};
    $rootScope.Tags = {};

    /*
    * Cached Selectors ( not sure which of these are still needed )
    */
    $scope.wonder = angular.element(document.getElementById('wonder'));
    $scope.wrapper = angular.element(document.getElementById('wrapper'));
    $scope.html = angular.element(document.querySelector('html'));
    $scope.body = angular.element(document.body);
    $scope.currentRoute = $location;

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
        $scope.wonder.removeClass('aside');
        $scope.wrapper.removeClass('aside');
        $scope.html.removeClass('aside');
        $scope.body.removeClass('aside');
    };

    $rootScope.toggleNav = function () {
        $scope.wonder.toggleClass('aside');
        $scope.wrapper.toggleClass('aside');
        $scope.html.toggleClass('aside');
        $scope.body.toggleClass('aside');
    };

    $scope.toggleQuickShare = function (e) {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.showQuickShare = !$scope.showQuickShare;
            });
        });
    };

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

    $scope.$on('video-upload-success', function (event) {

    });

    /*
    * Listen for route change errors
    */
    $rootScope.$on('$routeChangeError', function(error){
        console.log('route fail', arguments);
        AuthService.redirect();
    });

    /*
    * Route changed successfully
    */
    $rootScope.$on('$locationChangeSuccess', function (event, newRoute, oldRoute) {

        var newRoutePart = newRoute.replace(/http:\/\/localhost:5000\/#\/(\w*)\/.+/, '$1');
        var oldRoutePart = oldRoute.replace(/http:\/\/localhost:5000\/#\/(\w*)\/.+/, '$1');

        $element.removeClass('route-' + oldRoutePart);
        $element.addClass('route-' + newRoutePart);

        $scope.wonder.removeClass('aside');
        $scope.wrapper.removeClass('aside');
        $scope.html.removeClass('aside');
        $scope.body.removeClass('aside');

        if ( !$rootScope.isEmpty($rootScope.Videos) ) {
            $rootScope.$broadcast('get videos');
        }

        if ( !$rootScope.isEmpty($rootScope.Tags) ) {
            $rootScope.$broadcast('get tags');
        }
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

}]);
