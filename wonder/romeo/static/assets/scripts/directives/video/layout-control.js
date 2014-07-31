angular
  .module('RomeoApp.directives')
  .directive('layoutControl', LayoutControl);


function LayoutControl ($templateCache, $rootScope, $cookies) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('layout-control.html'),
    scope : {

    },
    controller : function ($scope) {

      $scope.$on('$locationChangeStart', function(event) {
        $rootScope.layoutMode = 'column';
      });

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