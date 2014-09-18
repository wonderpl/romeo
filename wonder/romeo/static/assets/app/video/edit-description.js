(function () {

  'use strict';

  function editDescription ($templateCache, VideoService) {

    var $frame;

    return {
      replace: true,
      restrict: 'E',
      template : $templateCache.get('video/edit-description.tmpl.html'),
      scope: {

      },
      link : function (scope, elem, attrs) {



      },
      controller : function ($scope) {


      }
    };
  }

  angular.module('RomeoApp.video').directive('editDescription', ['$templateCache', 'VideoService', editDescription]);

})();