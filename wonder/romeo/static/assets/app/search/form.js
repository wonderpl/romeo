(function(){

  'use strict';

  function searchForm ($templateCache) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('search/form.tmpl.html'),
      scope : {
        q : '=',
        location : '='
      }
    };
  }

  angular.module('RomeoApp.search').directive('searchForm', ['$templateCache', searchForm]);

})();




