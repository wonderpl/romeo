angular
  .module('RomeoApp.video')
  .directive('layoutControl', LayoutControl);


function LayoutControl ($templateCache, $rootScope, $cookies) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('video/collaborate/layout-control.dir.html'),
    scope : true,
    controller : function ($scope) {

      $scope.reposition = function (mode) {
        var layoutMode;
        switch (mode) {
          case 'column':
            layoutMode = 'column';
          break;
          case 'wide':
            layoutMode = 'wide';
          break;
          case 'mirror':
            layoutMode = 'mirror';
          break;
          default:
            layoutMode = 'column';
          break;
        }
        $cookies.layout = layoutMode;
        $rootScope.layoutMode = layoutMode;
      };
    }
  };
}