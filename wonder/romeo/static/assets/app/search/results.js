(function (){

  'use strict';

  function results ($templateCache, $location) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('search/results.dir.html'),
      scope : {
        results : '='
      }
    };
  }

  angular.module('RomeoApp.search').directive('results', ['$templateCache', '$location', results]);

})();

