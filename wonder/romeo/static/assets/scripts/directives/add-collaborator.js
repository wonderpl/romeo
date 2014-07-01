angular.module('RomeoApp.directives')
  .directive('addCollaborator', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('add-collaborator.html'),
    link : function (scope, elem, attrs) {

    }
  };
}]);