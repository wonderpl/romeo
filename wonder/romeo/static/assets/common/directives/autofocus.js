

(function () {

  'use strict';

  /* http://stackoverflow.com/a/20865048/3983822 */
  function autoFocus ($timeout) {
    return {
      restrict: 'AC',
      link: function(_scope, _element) {
        $timeout(function(){
          _element[0].focus();
        }, 0);
      }
    };
  }

  angular.module('RomeoApp.directives').directive('autoFocus', ['$timeout', autoFocus]);

})();

