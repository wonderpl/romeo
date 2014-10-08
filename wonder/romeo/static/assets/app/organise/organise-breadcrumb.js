angular
  .module('RomeoApp.organise')
  .directive('organiseBreadcrumb', ['$templateCache', OrganiseBreadcrumbDirective]);

function OrganiseBreadcrumbDirective ($templateCache) {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    template : $templateCache.get('organise/organise-breadcrumb.tmpl.html'),
    scope : {
      tag : '=',
      filterByRecent : '=',
      filterByCollaboration : '='
    },
    controller : function ($scope) {

    }
  };
}
