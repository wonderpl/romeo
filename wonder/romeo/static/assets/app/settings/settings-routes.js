// settings-routes.js
(function () {
  'use strict';
  function SettingsRouteProvider($routeProvider, securityAuthorizationProvider) {
    // Account management
    $routeProvider.when('/settings', {
      templateUrl: 'settings/index.tmpl.html',
      controller: 'SettingsCtrl',
      resolve: securityAuthorizationProvider.requireAuthenticated
    });

    // Edit  profile
    $routeProvider.when('/settings/connect', {
      templateUrl: 'settings/connect.tmpl.html',
      controller: 'SettingsCtrl',
      resolve: securityAuthorizationProvider.requireAuthenticated
    });

    // Public  profile
    $routeProvider.when('/settings/import', {
      templateUrl: 'settings/import.tmpl.html',
      controller: 'SettingsCtrl',
      resolve: securityAuthorizationProvider.requireAuthenticated
    });
  }

  angular.module('RomeoApp.settings').config(['$routeProvider', 'securityAuthorizationProvider', SettingsRouteProvider]);
})();