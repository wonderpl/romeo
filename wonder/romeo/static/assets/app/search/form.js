(function(){

  'use strict';

  function form ($templateCache) {

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

  angular.module('RomeoApp.search').directive('form', ['$templateCache', form]);

})();




