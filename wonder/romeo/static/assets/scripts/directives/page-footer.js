angular
  .module('RomeoApp.directives')
  .directive('pageFooter', PageFooterDirective);

function PageFooterDirective ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('page-footer.html')
  };
}
