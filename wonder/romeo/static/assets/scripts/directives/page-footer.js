angular
  .module('RomeoApp.directives')
  .directive('pageFooter', PageFooterDirective);

function PageFooterDirective ($templateCache) {

  'use strict';

  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('page-footer.html'),
    controller : function ($scope) {

      $scope.testNotify = function (status) {
        $scope.$emit('notify', {
          status : status,
          title : 'test notify ' + status,
          message : 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
        );
      };
    }
  };
}
