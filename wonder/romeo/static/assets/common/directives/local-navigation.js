//local-navigation.js
(function () {
'use strict';
function LocalNavigation($templateCache) {
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('directives/local-navigation.dir.html'),
    scope : true
  };
}

angular.module('RomeoApp.directives')
  .directive('localNavigation', ['$templateCache', LocalNavigation]);

})();