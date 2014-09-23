(function(){

  'use strict';

  function searchForm ($templateCache) {

    return {
      restrict : 'E',
      replace : true,
      template : $templateCache.get('search/form.dir.html'),
      scope : {
        q : '=',
        location : '='
      },
      link: function ($scope, $element) {
        $('body').on('focus', function () {
          $element.find('.search__form-input').focus();
        });
      }
    };
  }

  angular.module('RomeoApp.search').directive('searchForm', ['$templateCache', searchForm]);

})();




