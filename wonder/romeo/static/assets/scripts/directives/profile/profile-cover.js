angular.module('RomeoApp.directives')
  .directive('profileCover', ['$templateCache', function ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('profile-cover.html'),
    scope : {
      image: '='
    }
  };
}]);