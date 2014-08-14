angular
  .module('RomeoApp.directives')
  .directive('organiseBreadcrumb', ['$templateCache', OrganiseBreadcrumbDirective]);

function OrganiseBreadcrumbDirective ($templateCache) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise-breadcrumb.html'),
    scope : {
      tag : '=',
      filterByRecent : '='
    },
    controller : function ($scope) {

    }
  };
}
